/**
 * PC98_VisualEngine.js
 * Self-contained pixel-art / dithering visual engine for Dreammachine.
 *
 * Ported and bundled from PC-98 Vision (E:\CURSOR\PC-98 Vision\src\engine\):
 *   preprocess.js  — brightness / contrast / saturation
 *   dither.js      — Bayer 4×4, Bayer 8×8, Blue Noise ordered dithering
 *   color.js       — PALETTES, Euclidean colour matching, K-means++ extraction
 *   pixel.js       — pixel shape renderers (square, crt, lcd, diamond, cross, dot)
 *   pipeline.js    — frame orchestration
 *
 * Public API:
 *   PC98Engine.PALETTES
 *   PC98Engine.processImageData(imageData, options)
 *   PC98Engine.applyFilterToVideoFrame(videoElement, destCtx, options)
 *   PC98Engine.extractPalette(imageData, k)
 *
 * Integration with UnifiedConsole.jsx (three-line drop-in):
 *   const frame = octx.getImageData(0, 0, SMALL_W, SMALL_H)
 *   PC98Engine.processImageData(frame, filterOptions)
 *   octx.putImageData(frame, 0, 0)
 */

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPER
// ─────────────────────────────────────────────────────────────────────────────

function clamp(v) {
  return v < 0 ? 0 : v > 255 ? 255 : v | 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// PREPROCESS — brightness / contrast / saturation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Apply brightness / contrast / saturation adjustments to ImageData in-place.
 * Runs before dithering so that quantisation and grain operate on vivid input.
 *
 * @param {ImageData} imageData
 * @param {number} brightness  [-100, 100]
 * @param {number} contrast    [-100, 100]
 * @param {number} saturation  [-100, 100]
 * @returns {ImageData}
 */
function applyPreprocess(imageData, brightness, contrast, saturation) {
  if (brightness === 0 && contrast === 0 && saturation === 0) return imageData;

  const data   = imageData.data;
  const len    = data.length;
  const bVal   = brightness / 100 * 255;
  const cFactor = contrast >= 0 ? 1 + contrast / 100 * 2 : 1 + contrast / 100;
  const sFactor = saturation >= 0 ? 1 + saturation / 100 * 2 : 1 + saturation / 100;

  for (let i = 0; i < len; i += 4) {
    let r = data[i] + bVal;
    let g = data[i + 1] + bVal;
    let b = data[i + 2] + bVal;

    r = (r - 128) * cFactor + 128;
    g = (g - 128) * cFactor + 128;
    b = (b - 128) * cFactor + 128;

    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = lum + (r - lum) * sFactor;
    g = lum + (g - lum) * sFactor;
    b = lum + (b - lum) * sFactor;

    data[i]     = clamp(r);
    data[i + 1] = clamp(g);
    data[i + 2] = clamp(b);
  }

  return imageData;
}

// ─────────────────────────────────────────────────────────────────────────────
// DITHER — Bayer 4×4, Bayer 8×8, Blue Noise
// ─────────────────────────────────────────────────────────────────────────────

const BAYER_4 = new Uint8Array([
   0, 136,  34, 170,
 204,  68, 238, 102,
  51, 187,  17, 153,
 255, 119, 221,  85,
]);

const BAYER_8 = new Uint8Array([
   0, 128,  32, 160,   8, 136,  40, 168,
 192,  64, 224,  96, 200,  72, 232, 104,
  48, 176,  16, 144,  56, 184,  24, 152,
 240, 112, 208,  80, 248, 120, 216,  88,
  12, 140,  44, 172,   4, 132,  36, 164,
 204,  76, 236, 108, 196,  68, 228, 100,
  60, 188,  28, 156,  52, 180,  20, 148,
 252, 124, 220,  92, 244, 116, 212,  84,
]);

const BLUE_NOISE_SIZE = 64;

function generateBlueNoise() {
  const N     = BLUE_NOISE_SIZE;
  const total = N * N;
  let seed    = 0xdeadbeef;

  function rand() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 0x100000000;
  }

  const binary = new Uint8Array(total);
  for (let i = 0; i < total; i++) binary[i] = rand() < 0.5 ? 1 : 0;

  const sigma = 1.5;
  const s2    = 2 * sigma * sigma;

  function energy(x, y, arr) {
    let e = 0;
    for (let dy = -6; dy <= 6; dy++) {
      for (let dx = -6; dx <= 6; dx++) {
        const nx = ((x + dx) + N) % N;
        const ny = ((y + dy) + N) % N;
        if (arr[ny * N + nx]) e += Math.exp(-(dx * dx + dy * dy) / s2);
      }
    }
    return e;
  }

  for (let iter = 0; iter < total * 0.5; iter++) {
    let maxE = -Infinity, cx = 0, cy = 0;
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (binary[y * N + x] === 1) {
          const e = energy(x, y, binary);
          if (e > maxE) { maxE = e; cx = x; cy = y; }
        }
      }
    }
    let minE = Infinity, vx = 0, vy = 0;
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (binary[y * N + x] === 0) {
          const e = energy(x, y, binary);
          if (e < minE) { minE = e; vx = x; vy = y; }
        }
      }
    }
    if (cx === vx && cy === vy) break;
    binary[cy * N + cx] = 0;
    binary[vy * N + vx] = 1;
  }

  const ranked  = new Uint8Array(total);
  const scratch = new Uint8Array(binary);
  const ones    = [];
  for (let i = 0; i < total; i++) if (scratch[i]) ones.push(i);

  for (let rank = ones.length - 1; rank >= 0; rank--) {
    let maxE = -Infinity, best = 0;
    const step = Math.max(1, ((rank + 1) / 64) | 0);
    for (let k = 0; k < ones.length; k += step) {
      const idx = ones[k];
      if (scratch[idx]) {
        const x = idx % N, y = (idx / N) | 0;
        const e = energy(x, y, scratch);
        if (e > maxE) { maxE = e; best = idx; }
      }
    }
    ranked[best] = Math.round((rank / total) * 255);
    scratch[best] = 0;
  }

  const zeros = [];
  for (let i = 0; i < total; i++) if (!binary[i]) zeros.push(i);
  const zCopy = new Uint8Array(total);
  for (let rank = 0; rank < zeros.length; rank++) {
    let minE = Infinity, best = zeros[0];
    const step = Math.max(1, (zeros.length / 64) | 0);
    for (let k = 0; k < zeros.length; k += step) {
      const idx = zeros[k];
      if (zCopy[idx] === 0) {
        const x = idx % N, y = (idx / N) | 0;
        const e = energy(x, y, binary);
        if (e < minE) { minE = e; best = idx; }
      }
    }
    ranked[best] = Math.round(((ones.length + rank) / total) * 255);
    zCopy[best]  = 1;
    binary[best] = 1;
  }

  return ranked;
}

// Computed once at module load — deterministic, ~5 ms
const BLUE_NOISE = generateBlueNoise();

/**
 * Apply ordered dithering threshold offsets to ImageData in-place.
 * Must run BEFORE colour mapping.
 *
 * @param {ImageData} imageData
 * @param {'bayer4'|'bayer8'|'bluenoise'} pattern
 * @param {number} strength  0–100
 * @returns {ImageData}
 */
function applyDither(imageData, pattern, strength) {
  if (strength === 0) return imageData;

  const data   = imageData.data;
  const w      = imageData.width;
  const h      = imageData.height;
  const factor = strength / 100;

  let matrix, size;
  if (pattern === 'bayer4') {
    matrix = BAYER_4; size = 4;
  } else if (pattern === 'bayer8') {
    matrix = BAYER_8; size = 8;
  } else {
    matrix = BLUE_NOISE; size = BLUE_NOISE_SIZE;
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx       = (y * w + x) * 4;
      const threshold = (matrix[(y % size) * size + (x % size)] - 128) * factor;
      data[idx]     = clamp(data[idx]     + threshold);
      data[idx + 1] = clamp(data[idx + 1] + threshold);
      data[idx + 2] = clamp(data[idx + 2] + threshold);
    }
  }

  return imageData;
}

// ─────────────────────────────────────────────────────────────────────────────
// COLOR — palettes, Euclidean matching cache, K-means++ extraction
// ─────────────────────────────────────────────────────────────────────────────

const PALETTES = {
  pc98: [
    '#000000', '#0000AA', '#00AA00', '#00AAAA',
    '#AA0000', '#AA00AA', '#AA5500', '#AAAAAA',
    '#555555', '#5555FF', '#55FF55', '#55FFFF',
    '#FF5555', '#FF55FF', '#FFFF55', '#FFFFFF',
  ],
  gameboy: [
    '#0f380f', '#306230', '#8bac0f', '#9bbc0f',
  ],
  cga: [
    '#000000', '#0000AA', '#00AA00', '#00AAAA',
    '#AA0000', '#AA00AA', '#AA5500', '#AAAAAA',
    '#555555', '#5555FF', '#55FF55', '#55FFFF',
    '#FF5555', '#FF55FF', '#FFFF55', '#FFFFFF',
  ],
};

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

// 4096-entry RGB lookup cache (rebuilt only when palette changes)
let _cachedPaletteKey = '';
let _lookupCache      = null;

function buildCache(palette) {
  const key = palette.join(',');
  if (key === _cachedPaletteKey && _lookupCache) return;

  _cachedPaletteKey = key;
  const palRgb = palette.map(hexToRgb);
  _lookupCache = new Uint8Array(4096 * 3);

  for (let ri = 0; ri < 16; ri++) {
    for (let gi = 0; gi < 16; gi++) {
      for (let bi = 0; bi < 16; bi++) {
        const r = ri * 17, g = gi * 17, b = bi * 17;
        let best = 0, bestDist = Infinity;
        for (let p = 0; p < palRgb.length; p++) {
          const dr = r - palRgb[p][0];
          const dg = g - palRgb[p][1];
          const db = b - palRgb[p][2];
          const dist = dr * dr + dg * dg + db * db;
          if (dist < bestDist) { bestDist = dist; best = p; }
        }
        const ci = (ri * 256 + gi * 16 + bi) * 3;
        _lookupCache[ci]     = palRgb[best][0];
        _lookupCache[ci + 1] = palRgb[best][1];
        _lookupCache[ci + 2] = palRgb[best][2];
      }
    }
  }
}

/**
 * Map every pixel in ImageData to the nearest colour in palette.
 * Mutates imageData in-place.
 *
 * @param {ImageData} imageData
 * @param {string[]}  palette  array of hex strings
 * @returns {ImageData}
 */
function applyColorMapping(imageData, palette) {
  buildCache(palette);
  const data  = imageData.data;
  const len   = data.length;
  const cache = _lookupCache;

  for (let i = 0; i < len; i += 4) {
    const ci = ((data[i] >> 4) * 256 + (data[i + 1] >> 4) * 16 + (data[i + 2] >> 4)) * 3;
    data[i]     = cache[ci];
    data[i + 1] = cache[ci + 1];
    data[i + 2] = cache[ci + 2];
  }

  return imageData;
}

function sqDist(a, b) {
  const dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

/**
 * Extract k dominant colours from ImageData using K-means++.
 * Samples at most 4000 pixels for speed.
 *
 * @param {ImageData} imageData
 * @param {number}    k          8 or 16
 * @param {number}    [maxIter]  default 20
 * @returns {string[]}           array of k hex colour strings
 */
function extractPalette(imageData, k, maxIter = 20) {
  const data     = imageData.data;
  const total    = imageData.width * imageData.height;
  const maxSamp  = 4000;
  const step     = Math.max(1, Math.floor(total / maxSamp));
  const samples  = [];

  for (let i = 0; i < total; i += step) {
    const b = i * 4;
    samples.push([data[b], data[b + 1], data[b + 2]]);
  }

  const centroids = [samples[Math.floor(Math.random() * samples.length)]];
  while (centroids.length < k) {
    const dists  = samples.map(s => Math.min(...centroids.map(c => sqDist(s, c))));
    const sum    = dists.reduce((a, b) => a + b, 0);
    let   r      = Math.random() * sum;
    for (let i = 0; i < dists.length; i++) {
      r -= dists[i];
      if (r <= 0) { centroids.push(samples[i]); break; }
    }
  }

  const assignments = new Int32Array(samples.length);
  for (let iter = 0; iter < maxIter; iter++) {
    let changed = false;
    for (let i = 0; i < samples.length; i++) {
      let best = 0, bestD = Infinity;
      for (let c = 0; c < k; c++) {
        const d = sqDist(samples[i], centroids[c]);
        if (d < bestD) { bestD = d; best = c; }
      }
      if (assignments[i] !== best) { assignments[i] = best; changed = true; }
    }
    if (!changed) break;

    const sums   = Array.from({ length: k }, () => [0, 0, 0]);
    const counts = new Int32Array(k);
    for (let i = 0; i < samples.length; i++) {
      const c = assignments[i];
      sums[c][0] += samples[i][0];
      sums[c][1] += samples[i][1];
      sums[c][2] += samples[i][2];
      counts[c]++;
    }
    for (let c = 0; c < k; c++) {
      if (counts[c] > 0) {
        centroids[c] = [
          Math.round(sums[c][0] / counts[c]),
          Math.round(sums[c][1] / counts[c]),
          Math.round(sums[c][2] / counts[c]),
        ];
      }
    }
  }

  return centroids.map(([r, g, b]) => rgbToHex(r, g, b));
}

// ─────────────────────────────────────────────────────────────────────────────
// PIXEL SHAPES — square, crt, lcd, diamond, cross, dot
// ─────────────────────────────────────────────────────────────────────────────

function boostFactor(brightnessBoost) {
  return 1 + Math.max(0, brightnessBoost) / 100;
}

function boostedRgb(data, i, brightnessBoost) {
  const f = boostFactor(brightnessBoost);
  return {
    r: Math.min(255, Math.round(data[i]     * f)),
    g: Math.min(255, Math.round(data[i + 1] * f)),
    b: Math.min(255, Math.round(data[i + 2] * f)),
  };
}

function applyBoostToCopy(imageData, brightnessBoost) {
  if (brightnessBoost <= 0) return imageData;
  const f   = boostFactor(brightnessBoost);
  const out = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
  const d = out.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i]     = Math.min(255, Math.round(d[i]     * f));
    d[i + 1] = Math.min(255, Math.round(d[i + 1] * f));
    d[i + 2] = Math.min(255, Math.round(d[i + 2] * f));
  }
  return out;
}

function renderCellBased(ctx, imageData, cellSize, gap, drawCellFn, options = {}) {
  const {
    canvasBackground = '#000000',
    fillUnderlay     = false,
    brightnessBoost  = 0,
    shape            = 'square',
  } = options;

  const { width: w, height: h, data } = imageData;
  ctx.fillStyle = canvasBackground;
  ctx.fillRect(0, 0, w * cellSize, h * cellSize);

  const inner    = Math.max(1, cellSize - gap);
  const offset   = gap / 2;
  const doUnder  = fillUnderlay && (shape === 'cross' || shape === 'diamond');

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const { r, g, b } = boostedRgb(data, i, brightnessBoost);
      const px = x * cellSize + offset;
      const py = y * cellSize + offset;

      if (doUnder) {
        ctx.fillStyle = `rgb(${Math.round(r * 0.5)},${Math.round(g * 0.5)},${Math.round(b * 0.5)})`;
        ctx.fillRect(px, py, inner, inner);
      }
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      drawCellFn(ctx, px, py, inner);
    }
  }
}

function renderSquare(ctx, imageData, gap, cellSize, opts = {}) {
  const { brightnessBoost = 0 } = opts;
  if (gap <= 0) {
    const img = brightnessBoost > 0 ? applyBoostToCopy(imageData, brightnessBoost) : imageData;
    const mini = document.createElement('canvas');
    mini.width  = imageData.width;
    mini.height = imageData.height;
    mini.getContext('2d').putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(mini, 0, 0, imageData.width * cellSize, imageData.height * cellSize);
  } else {
    renderCellBased(ctx, imageData, cellSize, gap,
      (c, px, py, sz) => c.fillRect(px, py, sz, sz),
      { ...opts, shape: 'square' }
    );
  }
}

function renderCRT(ctx, imageData, opacity, gap, cellSize, opts = {}) {
  renderSquare(ctx, imageData, gap, cellSize, opts);
  const w = imageData.width  * cellSize;
  const h = imageData.height * cellSize;
  ctx.fillStyle = `rgba(0,0,0,${opacity.toFixed(3)})`;
  for (let y = cellSize - 1; y < h; y += cellSize) ctx.fillRect(0, y, w, 1);
}

function drawLCD(ctx, px, py, sz) {
  const r = Math.max(1, sz * 0.15);
  if (ctx.roundRect) {
    ctx.beginPath(); ctx.roundRect(px, py, sz, sz, r); ctx.fill();
  } else {
    ctx.fillRect(px, py, sz, sz);
  }
}

function drawDiamond(ctx, px, py, sz) {
  const cx = px + sz / 2, cy = py + sz / 2, rad = sz / 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy - rad); ctx.lineTo(cx + rad, cy);
  ctx.lineTo(cx, cy + rad); ctx.lineTo(cx - rad, cy);
  ctx.closePath(); ctx.fill();
}

function drawCross(ctx, px, py, sz) {
  const arm = sz * 0.30, mid = sz * 0.35;
  ctx.fillRect(px,       py + mid, sz,  arm);
  ctx.fillRect(px + mid, py,       arm, sz);
}

function drawDot(ctx, px, py, sz) {
  ctx.beginPath();
  ctx.arc(px + sz / 2, py + sz / 2, sz / 2, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Render pixel-art shapes from ImageData onto a 2D canvas context.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {ImageData}  imageData
 * @param {'square'|'crt'|'lcd'|'diamond'|'cross'|'dot'} shape
 * @param {number}     scanlineOpacity  0–100 (crt only)
 * @param {number}     [pixelGap=0]
 * @param {number}     [cellSize=1]
 * @param {object}     [opts]
 */
function renderPixelShape(ctx, imageData, shape, scanlineOpacity = 30,
                          pixelGap = 0, cellSize = 1, opts = {}) {
  switch (shape) {
    case 'crt':
      renderCRT(ctx, imageData, scanlineOpacity / 100, pixelGap, cellSize, opts);
      break;
    case 'lcd':
      renderCellBased(ctx, imageData, cellSize, pixelGap, drawLCD,
        { ...opts, shape: 'lcd' }); break;
    case 'diamond':
      renderCellBased(ctx, imageData, cellSize, pixelGap, drawDiamond,
        { ...opts, shape: 'diamond' }); break;
    case 'cross':
      renderCellBased(ctx, imageData, cellSize, pixelGap, drawCross,
        { ...opts, shape: 'cross' }); break;
    case 'dot':
      renderCellBased(ctx, imageData, cellSize, pixelGap, drawDot,
        { ...opts, shape: 'dot' }); break;
    case 'square':
    default:
      renderSquare(ctx, imageData, pixelGap, cellSize, opts);
      break;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PIPELINE INTERNALS
// ─────────────────────────────────────────────────────────────────────────────

/** Resolve palette option: preset name → string[] or pass-through array. */
function resolvePalette(palette) {
  if (typeof palette === 'string') return PALETTES[palette] ?? PALETTES.pc98;
  if (Array.isArray(palette) && palette.length > 0) return palette;
  return PALETTES.pc98;
}

/**
 * Full default options.
 * Merged with caller-supplied options in every public method.
 */
const DEFAULT_OPTIONS = {
  palette:         'pc98',
  pattern:         'bayer4',
  strength:        40,
  brightness:      0,
  contrast:        0,
  saturation:      0,
  pixelShape:      'square',
  cellSize:        1,
  pixelGap:        0,
  scanlineOpacity: 30,
  brightnessBoost: 0,
  pixelScale:      0.25,
};

// Scratch canvas reused across frames by applyFilterToVideoFrame
let _scratch      = null;
let _scratchW     = 0;
let _scratchH     = 0;

function getScratch(w, h) {
  if (!_scratch) _scratch = document.createElement('canvas');
  if (_scratchW !== w || _scratchH !== h) {
    _scratch.width  = w;
    _scratch.height = h;
    _scratchW = w;
    _scratchH = h;
  }
  return _scratch;
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

export const PC98Engine = {

  /**
   * Palette presets: 'pc98', 'gameboy', 'cga'.
   * Each value is a string[] of hex colours.
   */
  PALETTES,

  /**
   * Apply the full filter pipeline (preprocess → dither → colour map) to an
   * existing ImageData, mutating it in-place.
   *
   * Primary integration point for UnifiedConsole's offscreen clip canvas:
   *   const frame = octx.getImageData(0, 0, SMALL_W, SMALL_H)
   *   PC98Engine.processImageData(frame, { palette: 'pc98', strength: 50 })
   *   octx.putImageData(frame, 0, 0)
   *
   * @param {ImageData} imageData
   * @param {object}    [options]
   * @returns {ImageData}  the same mutated imageData
   */
  processImageData(imageData, options = {}) {
    const o = { ...DEFAULT_OPTIONS, ...options };
    applyPreprocess(imageData, o.brightness, o.contrast, o.saturation);
    applyDither(imageData, o.pattern, o.strength);
    applyColorMapping(imageData, resolvePalette(o.palette));
    return imageData;
  },

  /**
   * Full pipeline from a video element to a destination canvas context.
   * Internally downscales the video by `pixelScale`, runs preprocess → dither
   * → colour map, then renders pixel shapes back up to destCtx dimensions.
   *
   * Returns early (no draw) if the video is not ready.
   *
   * @param {HTMLVideoElement}        videoEl
   * @param {CanvasRenderingContext2D} destCtx
   * @param {object}                  [options]
   */
  applyFilterToVideoFrame(videoEl, destCtx, options = {}) {
    if (!videoEl || videoEl.readyState < 2) return;

    const o   = { ...DEFAULT_OPTIONS, ...options };
    const cw  = destCtx.canvas.width;
    const ch  = destCtx.canvas.height;
    if (!cw || !ch) return;

    const pixW = Math.max(1, Math.round(cw * o.pixelScale));
    const pixH = Math.max(1, Math.round(ch * o.pixelScale));

    const scratch = getScratch(pixW, pixH);
    const sctx    = scratch.getContext('2d', { willReadFrequently: true });
    sctx.imageSmoothingEnabled = false;
    sctx.drawImage(videoEl, 0, 0, pixW, pixH);

    const imageData = sctx.getImageData(0, 0, pixW, pixH);
    applyPreprocess(imageData, o.brightness, o.contrast, o.saturation);
    applyDither(imageData, o.pattern, o.strength);
    applyColorMapping(imageData, resolvePalette(o.palette));

    renderPixelShape(destCtx, imageData, o.pixelShape, o.scanlineOpacity,
      o.pixelGap, Math.max(1, Math.round(cw / pixW)), {
        brightnessBoost: o.brightnessBoost,
      }
    );
  },

  /**
   * Extract k dominant colours from ImageData via K-means++.
   * Returns an array of hex colour strings suitable for use as `palette`.
   *
   * @param {ImageData} imageData
   * @param {number}    k         number of colours (8 or 16 recommended)
   * @param {number}    [maxIter] default 20
   * @returns {string[]}
   */
  extractPalette(imageData, k, maxIter = 20) {
    return extractPalette(imageData, k, maxIter);
  },
};

export default PC98Engine;

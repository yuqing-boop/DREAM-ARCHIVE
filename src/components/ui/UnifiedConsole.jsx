import { useRef, useEffect } from 'react'

/**
 * UnifiedConsole
 * The Master Shell — owns full-screen centering, enforces 4:3 aspect ratio,
 * and renders the red plastic hardware surface. One instance per stage.
 *
 * Corner strategy:
 *   clip-path polygon() uses a quantised grid (CLIP_GRID_*) for stair-step corners.
 *   CSS border-radius is NOT used; clip-path owns the shape entirely.
 *
 * Background:
 *   Video is drawn full-bleed on the canvas; no canvas roundRect — the parent
 *   clip-path polygon is the only corner mask so it matches the pixelated outline.
 */

const CLIP_GRID_W = 256
const CLIP_GRID_H = 192
const CSS_RADIUS = 70  // visual corner radius in CSS px (canvas clip + clip-path)

/**
 * Builds a CSS polygon() string whose corners are staircase-quantised
 * on the CLIP_GRID_W × CLIP_GRID_H lattice.
 */
function buildPixelatedClipPath(w, h) {
  if (!w || !h) return ''
  const PW = CLIP_GRID_W
  const PH = CLIP_GRID_H
  const R = Math.round(CSS_RADIUS * PW / w)
  if (R <= 0) return ''

  const px = w / PW
  const py = h / PH

  function trBnd(i) {
    if (i >= R) return PW
    const dy = i + 0.5 - R
    const dx = Math.sqrt(Math.max(0, R * R - dy * dy))
    return Math.floor(PW - R + dx - 0.5) + 1
  }

  const trBnds = Array.from({ length: R + 1 }, (_, i) => trBnd(i))
  const tlBnds = trBnds.map(b => PW - b)

  const pts = []
  const pt = (x, y) => pts.push(`${x.toFixed(1)}px ${y.toFixed(1)}px`)

  let prevTL = 0
  pt(0, R * py)
  for (let i = R - 1; i >= 0; i--) {
    const nx = tlBnds[i]
    if (nx !== prevTL) {
      pt(prevTL * px, i * py)
      pt(nx * px, i * py)
      prevTL = nx
    }
  }

  pt(trBnds[0] * px, 0)

  let prevTR = trBnds[0]
  for (let i = 1; i <= R; i++) {
    const nx = trBnds[i]
    if (nx !== prevTR) {
      pt(prevTR * px, i * py)
      pt(nx * px, i * py)
      prevTR = nx
    }
  }

  pt(PW * px, (PH - R) * py)

  let prevBR = PW
  for (let iy = PH - R + 1; iy <= PH - 1; iy++) {
    const nx = trBnds[PH - 1 - iy]
    if (nx !== prevBR) {
      pt(prevBR * px, iy * py)
      pt(nx * px, iy * py)
      prevBR = nx
    }
  }
  pt(prevBR * px, h)

  pt(tlBnds[0] * px, h)

  let prevBL = tlBnds[0]
  for (let iy = PH - 2; iy >= PH - R; iy--) {
    const nx = tlBnds[PH - 1 - iy]
    if (nx !== prevBL) {
      pt(prevBL * px, iy * py)
      pt(nx * px, iy * py)
      prevBL = nx
    }
  }
  pt(0, (PH - R) * py)

  return `polygon(${pts.join(', ')})`
}

export default function UnifiedConsole({ children, className = '', style }) {
  const videoRef   = useRef(null)
  const canvasRef  = useRef(null)
  const consoleRef = useRef(null)

  useEffect(() => {
    const video     = videoRef.current
    const canvas    = canvasRef.current
    const consoleEl = consoleRef.current
    if (!video || !canvas || !consoleEl) return

    const ctx = canvas.getContext('2d')

    const syncSize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width  = w
      canvas.height = h
      if (w && h) {
        consoleEl.style.clipPath = buildPixelatedClipPath(w, h)
      }
    }
    syncSize()
    const ro = new ResizeObserver(syncSize)
    ro.observe(canvas)

    let rafId

    const draw = () => {
      rafId = requestAnimationFrame(draw)
      if (video.readyState < 2) return

      const cw = canvas.width
      const ch = canvas.height
      if (!cw || !ch) return

      ctx.clearRect(0, 0, cw, ch)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(video, 0, 0, cw, ch)
    }

    const startCanvas = () => {
      video.play().catch((err) => console.warn('[UnifiedConsole] bg video autoplay blocked:', err))
      rafId = requestAnimationFrame(draw)
    }

    if (video.readyState >= 1) {
      startCanvas()
    } else {
      video.addEventListener('loadedmetadata', startCanvas, { once: true })
    }

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,16,10,1)' }}>
      <div style={{
        width: '100%',
        maxWidth: 'calc((100vh - 60px) * 4 / 3)',
        aspectRatio: '4 / 3',
        filter: 'drop-shadow(0px 6px 18px rgba(0,0,0,0.9))',
      }}>
        <div
          ref={consoleRef}
          className={`unified-console flex flex-col relative ${className}`}
          style={{ width: '100%', height: '100%', ...style }}
        >
          <video
            ref={videoRef}
            src="/bg-moving.webm"
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              visibility: 'hidden',
              width: '1px',
              height: '1px',
              pointerEvents: 'none',
            }}
          />

          <canvas ref={canvasRef} className="console-bg-canvas" />

          {children}
        </div>
      </div>
    </div>
  )
}

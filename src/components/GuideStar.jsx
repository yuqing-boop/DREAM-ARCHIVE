import { useState, useRef, useLayoutEffect, useCallback } from 'react'
import Draggable from 'react-draggable'

/**
 * GuideStar — Draggable floating guide button
 * Anchor = viewport top-right via positionOffset (gutter beside UnifiedConsole).
 * bounds="body" breaks with position:fixed; use bounds={false}.
 */

const STORAGE_KEY = 'dream-archive-guide-opened'

/** Match CSS: clamp(96px, 22vmin, 500px) */
function starSizePx() {
  const vmin = Math.min(window.innerWidth, window.innerHeight) / 100
  return Math.min(500, Math.max(96, 22 * vmin))
}

function marginPx() {
  const vmin = Math.min(window.innerWidth, window.innerHeight) / 100
  return Math.max(12, 2 * vmin)
}

/** Top-right of viewport; nudge if overlapping .unified-console + 80px pad */
function computeGuideStarOffset() {
  const w = window.innerWidth
  const h = window.innerHeight
  const size = starSizePx()
  const m = marginPx()

  let x = w - size - m - 50
  let y = m - 80

  const el = document.querySelector('.unified-console')
  if (!el) {
    return {
      x: Math.round(Math.min(Math.max(0, x), w - size)),
      y: Math.round(Math.min(Math.max(0, y), h - size)),
    }
  }

  const u = el.getBoundingClientRect()
  const pad = 80
  const zone = {
    left: u.left - pad,
    top: u.top - pad,
    right: u.right + pad,
    bottom: u.bottom + pad,
  }

  const overlaps = (ax, ay) =>
    ax + size > zone.left &&
    ax < zone.right &&
    ay + size > zone.top &&
    ay < zone.bottom

  if (!overlaps(x, y)) {
    x = Math.min(Math.max(m, x), w - size - m)
    y = Math.min(Math.max(m, y), h - size - m)
    return { x: Math.round(x), y: Math.round(y) }
  }

  // Prefer sliding left along the top (stay in top margin band)
  const leftOfZone = zone.left - size - m
  if (leftOfZone >= m && !overlaps(leftOfZone, y)) {
    x = leftOfZone
  } else {
    const belowZone = zone.bottom + m
    if (belowZone + size <= h - m) {
      y = belowZone
      x = w - size - m
      if (overlaps(x, y) && leftOfZone >= m) {
        x = leftOfZone
      }
    } else {
      x = Math.max(m, Math.min(w - size - m, zone.left - size - m))
    }
  }

  x = Math.min(Math.max(m, x), w - size - m)
  y = Math.min(Math.max(m, y), h - size - m)

  return { x: Math.round(x), y: Math.round(y) }
}

const SECTION_LORE = `Dream Archive is a fragment-recovery system. Six characters are suspended in a loop — each holds a piece of a fractured timeline.

Navigate to each character's profile, read their DREAM NOTE, and collect their Neural Asset to unlock a fragment. Collect all six to reach the FULL SYNC ending.`

const SECTION_RULES = `1. Start from the HALL OF ROBBERS (selection screen).
2. Enter any character's console to read their story.
3. Touch the glowing Asset panel to collect it.
4. A ★ badge marks characters you've already witnessed.
5. Collect all 6 Assets → the FINALE unlocks automatically.
6. You can revisit characters freely — order doesn't matter.`

function readHasOpenedBefore() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function persistHasOpened() {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* ignore */
  }
}

export default function GuideStar() {
  const [open, setOpen] = useState(false)
  const [hasOpenedBefore, setHasOpenedBefore] = useState(readHasOpenedBefore)
  const [positionOffset, setPositionOffset] = useState(() =>
    typeof window !== 'undefined' ? computeGuideStarOffset() : { x: 0, y: 0 }
  )
  const nodeRef = useRef(null)

  const updateOffset = useCallback(() => {
    setPositionOffset(computeGuideStarOffset())
  }, [])

  useLayoutEffect(() => {
    updateOffset()
    window.addEventListener('resize', updateOffset)
    return () => window.removeEventListener('resize', updateOffset)
  }, [updateOffset])

  const didDrag = useRef(false)

  const handleDrag = (e, data) => {
    if (Math.abs(data.deltaX) > 0 || Math.abs(data.deltaY) > 0) {
      didDrag.current = true
    }
  }

  const handleStop = () => {
    setTimeout(() => {
      didDrag.current = false
    }, 0)
  }

  const handleStarClick = () => {
    if (didDrag.current) return
    setOpen((v) => {
      const next = !v
      if (next && !hasOpenedBefore) {
        persistHasOpened()
        setHasOpenedBefore(true)
      }
      return next
    })
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds={false}
      defaultPosition={{ x: 0, y: 0 }}
      positionOffset={positionOffset}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <div ref={nodeRef} className="guide-star-root">
        <div className="guide-star-cluster">
          <button
            type="button"
            className={`guide-star-btn${!hasOpenedBefore ? ' guide-star-btn--unseen' : ''}`}
            onClick={handleStarClick}
            title="操作指南"
            aria-label="Toggle guide"
          >
            <img
              src="/guide-star.png"
              alt="guide star"
              className="guide-star-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const svg = e.currentTarget.nextSibling
                if (svg) svg.style.display = 'block'
              }}
              draggable={false}
            />
            <svg
              className="guide-star-svg"
              viewBox="0 0 32 32"
              style={{ display: 'none' }}
              aria-hidden="true"
            >
              <rect x="14" y="0" width="4" height="4" fill="#fe5895" />
              <rect x="14" y="28" width="4" height="4" fill="#fe5895" />
              <rect x="0" y="14" width="4" height="4" fill="#fe5895" />
              <rect x="28" y="14" width="4" height="4" fill="#fe5895" />
              <rect x="4" y="4" width="4" height="4" fill="#fe5895" />
              <rect x="24" y="4" width="4" height="4" fill="#fe5895" />
              <rect x="4" y="24" width="4" height="4" fill="#fe5895" />
              <rect x="24" y="24" width="4" height="4" fill="#fe5895" />
              <rect x="12" y="4" width="8" height="4" fill="#fe5895" />
              <rect x="12" y="24" width="8" height="4" fill="#fe5895" />
              <rect x="4" y="12" width="4" height="8" fill="#fe5895" />
              <rect x="24" y="12" width="4" height="8" fill="#fe5895" />
              <rect x="8" y="8" width="16" height="16" fill="#fe5895" />
              <rect x="14" y="2" width="4" height="28" fill="#ff80b0" />
              <rect x="2" y="14" width="28" height="4" fill="#ff80b0" />
              <rect x="6" y="6" width="4" height="4" fill="#ff80b0" />
              <rect x="22" y="6" width="4" height="4" fill="#ff80b0" />
              <rect x="6" y="22" width="4" height="4" fill="#ff80b0" />
              <rect x="22" y="22" width="4" height="4" fill="#ff80b0" />
              <rect x="14" y="14" width="4" height="4" fill="#fff0f5" opacity="0.6" />
            </svg>
          </button>

          {open && (
            <div className="guide-panel font-federo">
              <div className="guide-header">
                <span className="guide-title font-pixelify">★ DREAM ARCHIVE GUIDE</span>
              </div>

              <div className="guide-section">
                <div className="guide-section-label font-pixelify">01 &nbsp;世界觀與故事流程</div>
                <p className="guide-body">{SECTION_LORE}</p>
              </div>

              <div className="guide-section">
                <div className="guide-section-label font-pixelify">02 &nbsp;遊戲規則</div>
                <p className="guide-body">{SECTION_RULES}</p>
              </div>

              <div className="guide-section" style={{ borderBottom: 'none' }}>
                <div className="guide-section-label font-pixelify">03 &nbsp;操作指南</div>
                <div className="guide-controls">
                  <ControlRow
                    img="/buttons/btn-pink-default.png"
                    label="上一位角色"
                    note="切換至前一個角色檔案"
                  />
                  <ControlRow
                    img="/buttons/btn-red-default.png"
                    label="下一位角色"
                    note="切換至後一個角色檔案"
                  />
                  <ControlRow
                    img="/buttons/btn-blue-default.png"
                    label="返回"
                    note="返回角色選擇畫面"
                  />
                  <ControlRow
                    img="/buttons/btn-green-default.png"
                    label="前進 / 確認"
                    note="進入故事 / 收集 Asset"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Draggable>
  )
}

function ControlRow({ img, label, note }) {
  return (
    <div className="guide-ctrl-row">
      <img
        src={img}
        alt={label}
        className="guide-ctrl-btn pixelated-image"
        draggable={false}
      />
      <div className="guide-ctrl-text">
        <span className="guide-ctrl-label font-pixelify">{label}</span>
        <span className="guide-ctrl-note">{note}</span>
      </div>
    </div>
  )
}

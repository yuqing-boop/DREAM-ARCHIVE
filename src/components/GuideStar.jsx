import { useState, useRef, useLayoutEffect } from 'react'
import Draggable from 'react-draggable'

/**
 * GuideStar — Draggable floating guide button
 * Default anchor: centre of star aligned to top-left corner of .unified-console.
 * Drag accumulates as a transform offset. Resize snaps back to default.
 */

const STORAGE_KEY = 'dream-archive-guide-opened'

function starSizePx() {
  const vmin = Math.min(window.innerWidth, window.innerHeight) / 100
  return Math.min(500, Math.max(96, 22 * vmin))
}

function computeAnchor() {
  const el = document.querySelector('.unified-console')
  if (!el) return { top: 0, left: 0 }
  const rect = el.getBoundingClientRect()
  const half = starSizePx() / 2
  return {
    top: Math.round(rect.top - half) + 60,
    left: Math.round(rect.left - half) + 60,
  }
}

const SECTION_LORE = `You are navigating the fragments of a surreal, forgotten night. To understand what truly happened, you must piece together the scattered memories of five individuals before you lost everything.`

const SECTION_RULES = `1. Watch the Experiences
Select a character and watch their story unfold. Completing a video will light up their unique Personal Item at the bottom of the screen.

2. Unlock 'Meanwhile' Clips
Once a character's story is complete, a 'Meanwhile' fragment on the right of the screen will be automatically decrypted, revealing what other characters were doing at that exact moment.

3. Collect the Waking Notes
Click on the illuminated Personal Items to collect the handwritten 'Dream Notes' left behind by each character.

4. Reveal the Final Truth 
Only by lighting up all five items can you unlock the Grand Storyline and discover the ultimate truth of that night.
`

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
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [anchor, setAnchor] = useState({ top: 0, left: 0 })
  const nodeRef = useRef(null)
  const didDrag = useRef(false)

  useLayoutEffect(() => {
    setAnchor(computeAnchor())
    const onResize = () => {
      setAnchor(computeAnchor())
      setDragPos({ x: 0, y: 0 })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleDrag = (e, data) => {
    if (Math.abs(data.deltaX) > 0 || Math.abs(data.deltaY) > 0) {
      didDrag.current = true
    }
    setDragPos({ x: data.x, y: data.y })
  }

  const handleStop = (e, data) => {
    setDragPos({ x: data.x, y: data.y })
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
      position={dragPos}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <div
        ref={nodeRef}
        className="guide-star-root"
        style={{ position: 'fixed', top: anchor.top, left: anchor.left }}
      >
        <div className="guide-star-cluster">
          <button
            type="button"
            className={`guide-star-btn${!hasOpenedBefore ? ' guide-star-btn--unseen' : ''}`}
            onClick={handleStarClick}
            title="MENU — Rules and controls"
            aria-label="Open menu: rules and how to play"
          >
            <img
              src="/guide-star.png"
              alt=""
              className="guide-star-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const svg = e.currentTarget.closest('button')?.querySelector('.guide-star-svg')
                if (svg) svg.style.display = 'block'
              }}
              draggable={false}
            />
            <span className="guide-star-menu-label font-pixelify" aria-hidden="true">
              MENU
            </span>
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

              <div className="guide-panel-scroll">
                <div className="guide-section">
                  <div className="guide-section-label font-pixelify">Welcome to the Archive</div>
                  <p className="guide-body">{SECTION_LORE}</p>
                </div>

                <div className="guide-section">
                  <div className="guide-section-label font-pixelify">How to Collect Memory Fragments</div>
                  <p className="guide-body">{SECTION_RULES}</p>
                </div>

                <div className="guide-section" style={{ borderBottom: 'none' }}>
                  <div className="guide-section-label font-pixelify">Button Directions(Character Page)</div>
                  <div className="guide-controls">
                    <ControlRow
                      img="/buttons/btn-pink-default.png"
                      label="Previous Character"
                    />
                    <ControlRow
                      img="/buttons/btn-red-default.png"
                      label="Next Character"
                    />
                    <ControlRow
                      img="/buttons/btn-blue-default.png"
                      label="Return to Selection Grid"
                    />
                    <ControlRow
                      img="/buttons/btn-green-default.png"
                      label="Proceed to End"
                      note="If you have not collected all 5 items, you will be guided to the false ending."
                    />
                  </div>
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

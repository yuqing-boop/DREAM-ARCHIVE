import { useEffect, useRef } from 'react'

const EYE_OPEN   = '/eye_open.png'
const EYE_CLOSED = '/eye_closed.png'

/**
 * Renders a JS-driven custom cursor that bypasses the browser's "cursor frozen
 * during press" limitation. Hides the native cursor via CSS (cursor: none on
 * body) and moves a floating <img> element to follow the pointer.
 *
 * pointerdown → switch to eye_closed instantly
 * pointerup / pointercancel → switch back to eye_open
 *
 * Uses a press-count ref to handle multi-touch / multi-button correctly.
 */
export default function CursorBlink() {
  const imgRef      = useRef(null)
  const pressCount  = useRef(0)

  useEffect(() => {
    // Create the cursor image element
    const el = document.createElement('img')
    el.src = EYE_OPEN
    el.style.cssText = [
      'position: fixed',
      'top: 0',
      'left: 0',
      'width: 64px',
      'height: 64px',
      'pointer-events: none',
      'z-index: 99999',
      'transform: translate(-50%, -50%)',
      'image-rendering: pixelated',
      'user-select: none',
    ].join(';')
    document.body.appendChild(el)
    imgRef.current = el

    // Hide native cursor everywhere
    document.body.style.cursor = 'none'
    const styleTag = document.createElement('style')
    styleTag.id = 'cursor-none-override'
    styleTag.textContent = '* { cursor: none !important; }'
    document.head.appendChild(styleTag)

    const onMove = (e) => {
      el.style.left = `${e.clientX}px`
      el.style.top  = `${e.clientY}px`
    }

    const onDown = () => {
      pressCount.current += 1
      el.src = EYE_CLOSED
    }

    const onUp = () => {
      pressCount.current = Math.max(0, pressCount.current - 1)
      if (pressCount.current === 0) el.src = EYE_OPEN
    }

    const opts = { capture: true }
    window.addEventListener('pointermove',   onMove,  opts)
    window.addEventListener('pointerdown',   onDown,  opts)
    window.addEventListener('pointerup',     onUp,    opts)
    window.addEventListener('pointercancel', onUp,    opts)

    return () => {
      window.removeEventListener('pointermove',   onMove,  opts)
      window.removeEventListener('pointerdown',   onDown,  opts)
      window.removeEventListener('pointerup',     onUp,    opts)
      window.removeEventListener('pointercancel', onUp,    opts)
      el.remove()
      document.body.style.cursor = ''
      document.getElementById('cursor-none-override')?.remove()
    }
  }, [])

  return null
}

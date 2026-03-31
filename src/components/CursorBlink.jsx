import { useEffect, useRef } from 'react'

/**
 * Attaches global pointer listeners that swap body class to switch between
 * eye_open (default) and eye_closed (while any pointer is pressed) cursors.
 * Uses a press-count ref so multi-touch / multi-button holds work correctly.
 */
export default function CursorBlink() {
  const pressCount = useRef(0)

  useEffect(() => {
    const onDown = () => {
      pressCount.current += 1
      document.body.classList.add('cursor-eye-closed')
    }

    const onUp = () => {
      pressCount.current = Math.max(0, pressCount.current - 1)
      if (pressCount.current === 0) {
        document.body.classList.remove('cursor-eye-closed')
      }
    }

    const opts = { capture: true }
    window.addEventListener('pointerdown', onDown, opts)
    window.addEventListener('pointerup', onUp, opts)
    window.addEventListener('pointercancel', onUp, opts)

    return () => {
      window.removeEventListener('pointerdown', onDown, opts)
      window.removeEventListener('pointerup', onUp, opts)
      window.removeEventListener('pointercancel', onUp, opts)
    }
  }, [])

  return null
}

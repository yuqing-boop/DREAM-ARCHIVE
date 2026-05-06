import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * TutorialArrow
 * Renders a bouncing arrow that points at a DOM element passed via `targetRef`.
 * Rendered via portal on `document.body` so position:fixed uses the viewport:
 * UnifiedConsole scales its content layer with CSS transform, which would shift
 * any fixed descendant away from coordinates from getBoundingClientRect().
 * `direction` chooses anchor side and aim: anchored above (+ aim down), below
 * (+ aim up), left (+ aim right), or right (+ aim left).
 * Optional `labelAfterArrow` lays out SVG then label for horizontal cues.
 * Optional `offsetX` / `offsetY` tweak the computed position (CSS px; +x right, +y down).
 */
export default function TutorialArrow({
  targetRef,
  direction = 'down',
  label,
  offsetX = 0,
  offsetY = 0,
  labelAfterArrow = false,
}) {
  const [pos, setPos] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    let rafScheduled = false
    const scheduleFlush = () => {
      if (rafScheduled) return
      rafScheduled = true
      requestAnimationFrame(() => {
        rafScheduled = false
        flush()
      })
    }

    const flush = () => {
      const el = targetRef?.current
      if (!el) {
        setPos(null)
        return
      }
      const r = el.getBoundingClientRect()
      setPos({
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
      })
    }

    flush()

    window.addEventListener('resize', scheduleFlush)
    document.addEventListener('scroll', scheduleFlush, true)
    let vvDetach = []
    const vv = window.visualViewport
    if (vv) {
      vv.addEventListener('resize', scheduleFlush)
      vv.addEventListener('scroll', scheduleFlush)
      vvDetach.push(() => {
        vv.removeEventListener('resize', scheduleFlush)
        vv.removeEventListener('scroll', scheduleFlush)
      })
    }

    let ro
    const el0 = targetRef?.current
    if (el0 && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(scheduleFlush)
      ro.observe(el0)
    }

    intervalRef.current = setInterval(scheduleFlush, 250)

    return () => {
      window.removeEventListener('resize', scheduleFlush)
      document.removeEventListener('scroll', scheduleFlush, true)
      vvDetach.forEach((fn) => fn())
      if (ro) ro.disconnect()
      clearInterval(intervalRef.current)
    }
  }, [targetRef])

  if (!pos) return null

  const ARROW_SIZE = 36  // px — arrowhead extent
  const GAP = 10         // px — gap between arrowhead tip and target edge

  // Compute arrowhead anchor so it touches the relevant edge of the target
  let arrowStyle = {}
  let arrowClass = ''

  switch (direction) {
    case 'up': {
      // Anchor above target; arrowhead tip points downward at the target
      const cx = pos.left + pos.width / 2
      arrowStyle = {
        left: cx,
        top: pos.top - ARROW_SIZE - GAP,
        transform: 'translateX(-50%)',
      }
      arrowClass = 'tutorial-arrow--up'
      break
    }
    case 'down': {
      // Anchor below target; arrowhead tip points upward at the target
      const cx = pos.left + pos.width / 2
      arrowStyle = {
        left: cx,
        top: pos.top + pos.height + GAP,
        transform: 'translateX(-50%)',
      }
      arrowClass = 'tutorial-arrow--down'
      break
    }
    case 'left': {
      // Arrow is to the left, pointing right toward the target's left edge
      const cy = pos.top + pos.height / 2
      arrowStyle = {
        left: pos.left - ARROW_SIZE - GAP,
        top: cy,
        transform: 'translateY(-50%)',
      }
      arrowClass = 'tutorial-arrow--left'
      break
    }
    case 'right': {
      // Arrow is to the right, pointing left toward the target's right edge
      const cy = pos.top + pos.height / 2
      arrowStyle = {
        left: pos.left + pos.width + GAP,
        top: cy,
        transform: 'translateY(-50%)',
      }
      arrowClass = 'tutorial-arrow--right'
      break
    }
    default:
      break
  }

  if ((offsetX || offsetY) && arrowStyle.left != null && arrowStyle.top != null) {
    arrowStyle = {
      ...arrowStyle,
      left: arrowStyle.left + offsetX,
      top: arrowStyle.top + offsetY,
    }
  }

  const labelAfterCls =
    labelAfterArrow && (direction === 'left' || direction === 'right')
      ? ' tutorial-arrow--label-after'
      : ''

  return createPortal(
    <div
      className={`tutorial-arrow ${arrowClass}${labelAfterCls}`}
      style={{ position: 'fixed', zIndex: 9999, pointerEvents: 'none', ...arrowStyle }}
      aria-hidden="true"
    >
      <svg
        className="tutorial-arrow-svg"
        width={ARROW_SIZE}
        height={ARROW_SIZE}
        viewBox="0 0 36 36"
      >
        <ArrowShape direction={direction} />
      </svg>
      {label && (
        <span className="tutorial-arrow-label font-pixelify">
          {label}
        </span>
      )}
    </div>,
    document.body,
  )
}

function ArrowShape({ direction }) {
  // Horizontal: `'left'` placement uses tip aimed right (+x); `'right'` uses tip aimed left (−x)
  switch (direction) {
    case 'up':    return <polygon points="18,34 2,2 34,2" fill="#ffd4ea" stroke="#b83060" strokeWidth="1.5" strokeLinejoin="round" />
    case 'down':  return <polygon points="18,2 34,34 2,34" fill="#ffd4ea" stroke="#b83060" strokeWidth="1.5" strokeLinejoin="round" />
    case 'left':  return <polygon points="34,18 2,2 2,34" fill="#ffd4ea" stroke="#b83060" strokeWidth="1.5" strokeLinejoin="round" />
    case 'right': return <polygon points="2,18 34,2 34,34" fill="#ffd4ea" stroke="#b83060" strokeWidth="1.5" strokeLinejoin="round" />
    default:      return null
  }
}

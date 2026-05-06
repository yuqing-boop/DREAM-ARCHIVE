import { forwardRef } from 'react'

/**
 * ScreenLip
 * The high-contrast inner scoop/recess that transitions the plastic surface
 * into a carved display area. Wraps RecessedScreen or other content.
 * Consistency Rule: always uses the same shadow logic to maintain the
 * "molded plastic" illusion.
 */
const ScreenLip = forwardRef(function ScreenLip({ children, className = '', style }, ref) {
  return (
    <div ref={ref} className={`screen-lip ${className}`} style={style}>
      {children}
    </div>
  )
})

export default ScreenLip

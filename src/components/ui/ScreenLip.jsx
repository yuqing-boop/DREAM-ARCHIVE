/**
 * ScreenLip
 * The high-contrast inner scoop/recess that transitions the plastic surface
 * into a carved display area. Wraps RecessedScreen or other content.
 * Consistency Rule: always uses the same shadow logic to maintain the
 * "molded plastic" illusion.
 */
export default function ScreenLip({ children, className = '' }) {
  return (
    <div className={`screen-lip ${className}`}>
      {children}
    </div>
  )
}

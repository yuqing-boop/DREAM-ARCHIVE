/**
 * RecessedScreen
 * The dark CRT display area carved into the plastic shell.
 * Includes a scanline overlay via CSS ::after pseudo-element.
 * Pass phosphor={true} for the green-tinted main-feed variant.
 *
 * All content rendered inside sits above the scanline layer (z-index > 5).
 */
export default function RecessedScreen({ children, className = '', phosphor = false, flat = false, ...rest }) {
  return (
    <div className={`recessed-screen ${phosphor ? 'phosphor' : ''} ${flat ? 'flat' : ''} ${className}`} {...rest}>
      {/* Content wrapper sits above the scanline ::after overlay */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  )
}

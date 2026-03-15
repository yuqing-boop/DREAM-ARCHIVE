/**
 * UnifiedConsole
 * The large outer red plastic shell that wraps an entire functional area.
 * Rule: one instance per screen — media and controls are carved INTO it,
 * not wrapped individually.
 */
export default function UnifiedConsole({ children, className = '' }) {
  return (
    <div className={`unified-console w-full h-full flex flex-col ${className}`}>
      {children}
    </div>
  )
}

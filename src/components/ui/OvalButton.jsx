/**
 * OvalButton
 * Tactile hardware-style oval button with deep shadows and high-contrast borders.
 * variant: 'red' | 'purple' | 'green'
 */
const VARIANTS = {
  red:    'oval-btn-red',
  purple: 'oval-btn-purple',
  green:  'oval-btn-green',
}

export default function OvalButton({
  children,
  onClick,
  variant = 'red',
  className = '',
  disabled = false,
  type = 'button',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`oval-btn ${VARIANTS[variant] ?? VARIANTS.red} ${className} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )
}

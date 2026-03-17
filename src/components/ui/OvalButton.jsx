/**
 * OvalButton — Vintage arcade dome button
 * Round, 3D raised, with optional embossed icon. No text.
 * variant: 'red' | 'purple' | 'pink' | 'orange' | 'green'
 * size:    'sm'  | 'md'     | 'lg'
 * icon:    'play' | 'back' | 'next' | 'prev' | 'restart' | 'home'
 */
const VARIANTS = {
  red:    'arcade-btn-red',
  purple: 'arcade-btn-purple',
  pink:   'arcade-btn-pink',
  orange: 'arcade-btn-orange',
  green:  'arcade-btn-green',
}

const SIZES = {
  sm: 'arcade-btn-sm',
  md: 'arcade-btn-md',
  lg: 'arcade-btn-lg',
}

export default function OvalButton({
  onClick,
  variant = 'red',
  size = 'md',
  icon,
  className = '',
  disabled = false,
  type = 'button',
  style,
  iconStyle,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`arcade-btn ${SIZES[size] ?? SIZES.md} ${VARIANTS[variant] ?? VARIANTS.red} ${className} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      style={style}
    >
      {icon && <ArcadeIcon name={icon} style={iconStyle} />}
    </button>
  )
}

function ArcadeIcon({ name, style }) {
  const paths = {
    play:    <polygon points="10,5 20,12 10,19" />,
    next:    <polygon points="10,5 20,12 10,19" />,
    back:    <polygon points="14,5 4,12 14,19" />,
    prev:    <polygon points="14,5 4,12 14,19" />,
    pause:   <><rect x="7" y="5" width="4" height="14" rx="1" /><rect x="13" y="5" width="4" height="14" rx="1" /></>,
    restart: (
      <>
        <path
          d="M12,4 A8,8 0 1,0 20,12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <polygon points="13,1 13,7.5 8.5,4" />
      </>
    ),
    home: (
      <path d="M12,3 L2,11 L6,11 L6,20 L10,20 L10,14 L14,14 L14,20 L18,20 L18,11 L22,11 Z" />
    ),
  }

  if (!paths[name]) return null

  return (
    <svg viewBox="0 0 24 24" className="arcade-btn-icon" aria-hidden="true" style={style}>
      {paths[name]}
    </svg>
  )
}

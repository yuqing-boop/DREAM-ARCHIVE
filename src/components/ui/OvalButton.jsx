/**
 * OvalButton — PNG-based arcade dome button
 * Visual states (default / hover / active) are baked into PNG assets.
 * Assets expected at: /buttons/btn-{variant}-default.png
 *                     /buttons/btn-{variant}-hover.png
 *                     /buttons/btn-{variant}-active.png
 * variant: 'red' | 'blue' | 'pink' | 'green'
 * size:    'sm'  | 'md'     | 'lg'
 */
import { useState } from 'react'

const SIZES = {
  sm: 'arcade-btn-sm',
  md: 'arcade-btn-md',
  lg: 'arcade-btn-lg',
}

export default function OvalButton({
  onClick,
  variant = 'red',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  style,
}) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const state = disabled ? 'default' : pressed ? 'active' : hovered ? 'hover' : 'default'
  const src = `/buttons/btn-${variant}-${state}.png`

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`arcade-btn ${SIZES[size] ?? SIZES.md} ${className} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      <img
        src={src}
        alt={variant}
        draggable={false}
        className="w-full h-full object-contain select-none pointer-events-none"
      />
    </button>
  )
}

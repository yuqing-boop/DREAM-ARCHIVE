import OvalButton from '../ui/OvalButton'

/**
 * NavCluster
 * Persistent bottom-right navigation controls — round arcade buttons.
 * Renders only the buttons whose handlers are provided.
 * 2×2 grid: [prevChar, nextChar / back, next] with optional restart above.
 */
export default function NavCluster({
  onBack,
  onNext,
  onRestart,
  onPrevChar,
  onNextChar,
  disableNext = false,
}) {
  return (
    <div className="absolute flex flex-col items-end z-20" style={{ bottom: 'calc(3% + 10px)', right: 'calc(3% + 20px)', gap: '1.2vmin' }}>
      {onRestart && (
        <OvalButton variant="purple" icon="restart" onClick={onRestart} />
      )}
      <div className="grid grid-cols-2" style={{ gap: '0.8vmin' }}>
        {onPrevChar && (
          <OvalButton variant="pink" size="sm" onClick={onPrevChar} />
        )}
        {onNextChar && (
          <OvalButton variant="orange" size="sm" onClick={onNextChar} />
        )}
        {onBack && (
          <OvalButton
            variant="purple"
            size="sm"
            onClick={onBack}
          />
        )}
        {onNext && (
          <OvalButton
            variant="green"
            size="sm"
            onClick={onNext}
            disabled={disableNext}
          />
        )}
      </div>
    </div>
  )
}

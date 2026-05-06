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
        <OvalButton
          variant="blue"
          onClick={onRestart}
          title="Restart"
          aria-label="Restart"
        />
      )}
      <div className="grid grid-cols-2" style={{ gap: '0.8vmin' }}>
        {onPrevChar && (
          <OvalButton
            variant="pink"
            size="sm"
            onClick={onPrevChar}
            title="Previous"
            aria-label="Previous"
          />
        )}
        {onNextChar && (
          <OvalButton
            variant="red"
            size="sm"
            onClick={onNextChar}
            title="Next"
            aria-label="Next"
          />
        )}
        {onBack && (
          <OvalButton
            variant="blue"
            size="sm"
            onClick={onBack}
            title="Back"
            aria-label="Back"
          />
        )}
        {onNext && (
          <OvalButton
            variant="green"
            size="sm"
            onClick={onNext}
            disabled={disableNext}
            title="Proceed"
            aria-label="Proceed"
          />
        )}
      </div>
    </div>
  )
}

import OvalButton from '../ui/OvalButton'

/**
 * NavCluster
 * Persistent bottom-right navigation controls.
 * Renders only the buttons whose handlers are provided.
 *
 * Props:
 *   onBack   — fires when the Back button is pressed
 *   onNext   — fires when the Next / Verdict button is pressed
 *   onRestart — fires when the Restart button is pressed (Finale only)
 *   nextLabel — override the default "Next" label
 *   backLabel — override the default "Back" label
 *   disableNext — greys out the Next button
 */
export default function NavCluster({
  onBack,
  onNext,
  onRestart,
  nextLabel = 'Next',
  backLabel = 'Back',
  disableNext = false,
}) {
  return (
    <div className="absolute bottom-5 right-6 flex items-center gap-3 z-20">
      {onRestart && (
        <OvalButton variant="purple" onClick={onRestart} className="text-sm px-5">
          Restart
        </OvalButton>
      )}
      {onBack && (
        <OvalButton variant="purple" onClick={onBack} className="text-sm px-5">
          {backLabel}
        </OvalButton>
      )}
      {onNext && (
        <OvalButton
          variant="green"
          onClick={onNext}
          disabled={disableNext}
          className="text-sm px-5"
        >
          {nextLabel}
        </OvalButton>
      )}
    </div>
  )
}

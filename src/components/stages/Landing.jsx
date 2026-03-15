import UnifiedConsole from '../ui/UnifiedConsole'
import ScreenLip from '../ui/ScreenLip'
import RecessedScreen from '../ui/RecessedScreen'
import OvalButton from '../ui/OvalButton'

/**
 * Stage 1 — The Descent
 * A single large UnifiedConsole centered on screen.
 * The title is stamped directly on the plastic surface.
 * One Start button descends into the selection stage.
 */
export default function Landing({ onStart }) {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#1a0008] p-6">
      <UnifiedConsole className="max-w-4xl w-full h-[88vh] flex flex-col items-center justify-between p-10">

        {/* Top badge — stamped on plastic */}
        <div className="w-full flex justify-between items-start">
          <span className="font-amarante text-xs tracking-[0.3em] text-[#e8a0a8] uppercase opacity-60">
            Hardware Rev. D
          </span>
          <span className="font-federo text-xs tracking-widest text-[#e8a0a8] opacity-60">
            UNIFIED CONSOLE
          </span>
        </div>

        {/* Central display: scoped/recessed title panel */}
        <ScreenLip className="w-full flex-1 my-6">
          <RecessedScreen phosphor className="w-full h-full flex flex-col items-center justify-center gap-8 p-10">

            {/* Subtitle — glowing on the CRT */}
            <p className="screen-label text-sm tracking-[0.4em] uppercase">
              — Witness Protocol Active —
            </p>

            <p className="font-federo text-[#c8e0c8] text-base text-center max-w-md leading-relaxed opacity-80">
              Six operatives. Six operations. Only one account of events survives.
              Choose your witness carefully.
            </p>

          </RecessedScreen>
        </ScreenLip>

        {/* Bottom action row */}
        <div className="flex flex-col items-center gap-4">
          <OvalButton
            variant="red"
            onClick={onStart}
            className="text-xl px-12 py-3 tracking-widest"
          >
            Initiate
          </OvalButton>
          <span className="font-federo text-xs text-[#e8a0a8] opacity-40 tracking-widest uppercase">
            Press to Begin
          </span>
        </div>

      </UnifiedConsole>
    </div>
  )
}

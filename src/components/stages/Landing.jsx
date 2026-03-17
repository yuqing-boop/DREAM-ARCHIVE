import UnifiedConsole from '../ui/UnifiedConsole'
import ScreenLip from '../ui/ScreenLip'
import RecessedScreen from '../ui/RecessedScreen'
import OvalButton from '../ui/OvalButton'
import { landingVideoUrl } from '../../data/characters'

/**
 * Stage 1 — The Descent
 * UnifiedConsole owns centering and 4:3 ratio.
 * The central slot is a full-fill looping video.
 */
export default function Landing({ onStart }) {
  return (
    <UnifiedConsole className="flex flex-col items-center justify-between p-10">

      {/* Top badge — stamped on plastic */}
      <div className="w-full flex justify-between items-start shrink-0">
        <span className="font-amarante text-xs tracking-[0.3em] text-[#e8a0a8] uppercase opacity-60">
          Hardware Rev. D
        </span>
        <span className="font-federo text-xs tracking-widest text-[#e8a0a8] opacity-60">
          UNIFIED CONSOLE
        </span>
      </div>

      {/* Central display — full-fill looping video slot */}
      <ScreenLip className="w-full flex-1 min-h-0 my-6 flex items-center justify-center">
        <div className="w-full aspect-video max-h-full">
          <RecessedScreen phosphor className="w-full h-full relative overflow-hidden">

            {/* Looping background video — fills the slot */}
            <video
              src={landingVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover absolute inset-0 z-0"
            />


          </RecessedScreen>
        </div>
      </ScreenLip>

      {/* Bottom action row — large red arcade button */}
      <div className="shrink-0 flex flex-col items-center gap-4">
        <OvalButton
          variant="red"
          size="lg"
          icon="play"
          onClick={onStart}
        />
      </div>

    </UnifiedConsole>
  )
}

import { useState, useRef } from 'react'
import UnifiedConsole from '../ui/UnifiedConsole'
import ScreenLip from '../ui/ScreenLip'
import RecessedScreen from '../ui/RecessedScreen'
import OvalButton from '../ui/OvalButton'
import { goodEndVideoUrl, badEndVideoUrl } from '../../data/characters'

/**
 * Stage 4 — The Verdict
 * Ending is purely determined by whether all 5 assets are collected.
 * No character-specific content — good/bad end videos are shared.
 */
export default function Finale({ onRestart, onBack, collectedIds = [] }) {
  const isGood = collectedIds.length === 5
  const videoSrc = isGood ? goodEndVideoUrl : badEndVideoUrl
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    videoRef.current?.play()
  }

  return (
    <UnifiedConsole
      className="flex flex-col p-5 gap-4"
      style={{
        background: isGood
          ? 'linear-gradient(160deg, #0d3d1a 0%, #C41E3A 60%)'
          : 'linear-gradient(160deg, #2a0808 0%, #C41E3A 60%)',
      }}
    >

      {/* Ending video — fills the bulk of the console */}
      <ScreenLip className="flex-1 min-h-0 flex items-center justify-center m-[30px]">
        <div className="w-[calc(100%-60px)] aspect-[4/3] max-h-[calc(100%-60px)]">
          <RecessedScreen
            phosphor={isGood}
            className="w-full h-full flex items-center justify-center"
          >
            <video
              key={videoSrc}
              ref={videoRef}
              src={videoSrc}
              loop
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="absolute inset-0 w-full h-full object-cover z-10"
            />

            {/* Play button — visible until user starts playback */}
            {!isPlaying && (
              <div className="absolute bottom-5 left-0 right-0 flex justify-center z-20">
                <OvalButton variant="red" size="sm" icon="play" onClick={handlePlay} />
              </div>
            )}

            {/* Navigation buttons */}
            <div
              className="absolute z-20 flex flex-col items-center gap-2"
              style={{ bottom: 'calc(3% + 10px)', right: 'calc(3%)' }}
            >
              <OvalButton variant="purple" icon="restart" onClick={onRestart} />
              <OvalButton variant="purple" size="sm" onClick={onBack} />
            </div>
          </RecessedScreen>
        </div>
      </ScreenLip>

    </UnifiedConsole>
  )
}

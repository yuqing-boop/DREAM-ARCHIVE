import { useRef } from 'react'
import UnifiedConsole from '../ui/UnifiedConsole'
import ScreenLip from '../ui/ScreenLip'
import RecessedScreen from '../ui/RecessedScreen'
import OvalButton from '../ui/OvalButton'
import { characters } from '../../data/characters'

/**
 * Stage 2 — The Hall of Robbers
 * UnifiedConsole owns centering and 4:3 ratio.
 * Grid: 3 columns × 2 rows, gap-2, slots are aspect-[4/5].
 */
export default function SelectionGrid({ onSelect, collected, onGoToLanding }) {
  return (
    <UnifiedConsole className="flex flex-col p-10 gap-4">

      {/* Header stamped on plastic */}
      <div className="flex justify-end items-center shrink-0">
        <span className="font-federo text-xs tracking-widest text-[#e8a0a8] opacity-60 uppercase">
          Select a Witness
        </span>
      </div>

      {/* Character grid — fills available space, slots control their own ratio */}
      <ScreenLip className="flex-1 min-h-0 grid p-2 mx-[50px] scale-95 translate-y-5">
      <div className="w-full min-h-0 grid grid-cols-3 grid-rows-2 gap-6">
          {characters.map((char, index) => (
            <CharacterSlot
              key={char.id}
              character={char}
              isCollected={collected?.has(char.id)}
              onSelect={onSelect}
              wide={index === 1}
            />
          ))}
        </div>
      </ScreenLip>

      {/* Footer — witness count + back-to-landing arcade button */}
      <div className="shrink-0 flex items-center justify-between px-2">
        <span className="font-federo text-xs text-[#e8a0a8] opacity-40 tracking-[0.3em] uppercase">
          {collected?.size ?? 0} of {characters.length} Witnessed
        </span>
        <OvalButton variant="red" icon="back" onClick={onGoToLanding} />
      </div>

    </UnifiedConsole>
  )
}

function CharacterSlot({ character, isCollected, onSelect, wide }) {
  const videoRef = useRef(null)

  const handleMouseEnter = () => videoRef.current?.play()
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <RecessedScreen
      className={`w-full relative group cursor-pointer overflow-hidden char-slot${wide ? ' col-span-2' : ''}`}
      phosphor={false}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail — fades out when preview video plays */}
      <img
        src={character.thumbnailImage}
        alt={character.name}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${character.previewVideo ? 'group-hover:opacity-0' : 'group-hover:scale-105 transition-transform'}`}
      />

      {/* Hover preview video */}
      {character.previewVideo && (
        <video
          ref={videoRef}
          src={character.previewVideo}
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-0" />

      {/* Collected badge */}
      {isCollected && (
        <div className="absolute top-2 right-2 z-20 bg-[#1a8f34] text-white text-[10px] font-amarante tracking-widest px-2 py-0.5 rounded-full border border-[#0a3d16]">
          WITNESSED
        </div>
      )}

      {/* Name label */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-3 text-center transition-transform duration-300 group-hover:translate-y-full">
        <p className="font-amarante text-base text-white leading-tight tracking-wide drop-shadow-lg">
          {character.name}
        </p>
      </div>

      {/* Hover: select overlay — targeting reticle */}
      <button
        onClick={() => onSelect(character)}
        className="char-slot-overlay absolute inset-0 z-30 flex items-center justify-center bg-[#C41E3A]/0 hover:bg-[#C41E3A]/30 transition-colors duration-200"
        aria-label={`Select ${character.name}`}
      >
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="24" r="14" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            <circle cx="24" cy="24" r="4" fill="rgba(255,255,255,0.8)" />
            <line x1="24" y1="6" x2="24" y2="14" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            <line x1="24" y1="34" x2="24" y2="42" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            <line x1="6" y1="24" x2="14" y2="24" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            <line x1="34" y1="24" x2="42" y2="24" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
          </svg>
        </span>
      </button>
    </RecessedScreen>
  )
}

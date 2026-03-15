import UnifiedConsole from '../ui/UnifiedConsole'
import ScreenLip from '../ui/ScreenLip'
import RecessedScreen from '../ui/RecessedScreen'
import { characters } from '../../data/characters'

/**
 * Stage 2 — The Hall of Robbers
 * One large UnifiedConsole centered on screen.
 * Inside: a 2×3 grid of character slots, gap-2, ~70% viewport.
 * Each slot is a RecessedScreen carved into the plastic, with a
 * thumbnail image and name label. Clicking selects the character.
 */
export default function SelectionGrid({ onSelect, collected }) {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#1a0008] p-4">
      <UnifiedConsole className="w-[72vw] h-[82vh] flex flex-col p-6 gap-4">

        {/* Header stamped on plastic */}
        <div className="flex justify-end items-center shrink-0">
          <span className="font-federo text-xs tracking-widest text-[#e8a0a8] opacity-60 uppercase">
            Select a Witness
          </span>
        </div>

        {/* Character grid — the main carved structure */}
        <ScreenLip className="flex-1">
          <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-2">
            {characters.map((char) => (
              <CharacterSlot
                key={char.id}
                character={char}
                isCollected={collected?.has(char.id)}
                onSelect={onSelect}
              />
            ))}
          </div>
        </ScreenLip>

        {/* Footer label */}
        <div className="shrink-0 flex justify-center">
          <span className="font-federo text-xs text-[#e8a0a8] opacity-40 tracking-[0.3em] uppercase">
            {collected?.size ?? 0} of {characters.length} Witnessed
          </span>
        </div>

      </UnifiedConsole>
    </div>
  )
}

function CharacterSlot({ character, isCollected, onSelect }) {
  return (
    <RecessedScreen
      className="w-full h-full relative group cursor-pointer overflow-hidden"
      phosphor={false}
    >
      {/* Thumbnail fills the slot */}
      <img
        src={character.thumbnailImage}
        alt={character.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Gradient overlay — readable even on bright images */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

      {/* Collected badge */}
      {isCollected && (
        <div className="absolute top-2 right-2 z-20 bg-[#1a8f34] text-white text-[10px] font-amarante tracking-widest px-2 py-0.5 rounded-full border border-[#0a3d16]">
          WITNESSED
        </div>
      )}

      {/* Name / role label */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
        <p className="font-amarante text-base text-white leading-tight tracking-wide drop-shadow-lg">
          {character.name}
        </p>
        <p className="font-federo text-[11px] text-[#c8f0c8] tracking-widest uppercase opacity-80">
          {character.role}
        </p>
      </div>

      {/* Hover: select overlay */}
      <button
        onClick={() => onSelect(character)}
        className="absolute inset-0 z-30 flex items-center justify-center bg-[#C41E3A]/0 hover:bg-[#C41E3A]/30 transition-colors duration-200"
        aria-label={`Select ${character.name}`}
      >
        <span className="opacity-0 group-hover:opacity-100 font-amarante text-white text-sm tracking-widest uppercase border border-white/60 px-4 py-1 rounded-full backdrop-blur-sm transition-opacity duration-200">
          Witness
        </span>
      </button>
    </RecessedScreen>
  )
}

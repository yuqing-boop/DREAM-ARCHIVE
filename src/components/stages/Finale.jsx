import UnifiedConsole from '../ui/UnifiedConsole'
import ScreenLip from '../ui/ScreenLip'
import RecessedScreen from '../ui/RecessedScreen'
import NavCluster from '../navigation/NavCluster'

/**
 * Stage 4 — The Verdict
 * Full-screen UnifiedConsole.
 * A massive RecessedScreen fills most of the console playing the
 * good/bad ending media for the selected character.
 * Verdict badge and character name are stamped on the plastic.
 */
export default function Finale({ character, onRestart, onBack }) {
  if (!character) return null

  const isGood = character.ending === 'good'

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#1a0008] p-4">
      <UnifiedConsole
        className="w-full h-full max-w-[98vw] max-h-[96vh] flex flex-col p-5 gap-4 relative"
        style={{
          background: isGood
            ? 'linear-gradient(160deg, #0d3d1a 0%, #C41E3A 60%)'
            : 'linear-gradient(160deg, #2a0808 0%, #C41E3A 60%)',
        }}
      >

        {/* Header — verdict stamped on the plastic */}
        <div className="shrink-0 flex items-center justify-between px-2">
          <div>
            <p className="font-federo text-xs tracking-[0.4em] text-[#e8a0a8] uppercase opacity-60 mb-1">
              Operative File — Closed
            </p>
            <h2 className="console-title text-3xl tracking-wide">
              {character.name}
            </h2>
            <p className="font-federo text-sm tracking-widest uppercase mt-0.5"
               style={{ color: isGood ? '#6dffaa' : '#ff6d6d' }}>
              {character.role}
            </p>
          </div>

          {/* Verdict badge */}
          <div
            className="flex flex-col items-center justify-center rounded-full w-28 h-28 border-4"
            style={{
              background: isGood
                ? 'radial-gradient(circle, #1a8f34 0%, #0a3d16 100%)'
                : 'radial-gradient(circle, #8f1a1a 0%, #3d0a0a 100%)',
              borderColor: isGood ? '#2ab84a' : '#b82a2a',
              boxShadow: isGood
                ? '0 0 30px rgba(26,143,52,0.6), inset 0 0 20px rgba(0,0,0,0.6)'
                : '0 0 30px rgba(143,26,26,0.6), inset 0 0 20px rgba(0,0,0,0.6)',
            }}
          >
            <span className="font-amarante text-white text-xs tracking-widest uppercase leading-tight text-center px-2">
              {isGood ? 'CLEARED' : 'CONVICTED'}
            </span>
            <span className="text-3xl mt-1">{isGood ? '✓' : '✗'}</span>
          </div>
        </div>

        {/* Main ending media — fills the bulk of the console */}
        <ScreenLip className="flex-1 min-h-0">
          <RecessedScreen
            phosphor={isGood}
            className="w-full h-full flex items-center justify-center"
          >
            <EndingMedia media={character.endingMedia} isGood={isGood} />

            {/* Verdict overlay text */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 z-20 pointer-events-none">
              <div
                className="px-8 py-3 rounded-lg backdrop-blur-sm"
                style={{
                  background: 'rgba(0,0,0,0.65)',
                  border: `1px solid ${isGood ? '#2ab84a55' : '#b82a2a55'}`,
                }}
              >
                <p
                  className="font-amarante text-2xl tracking-widest uppercase"
                  style={{
                    color: isGood ? '#6dffaa' : '#ff9090',
                    textShadow: isGood
                      ? '0 0 20px rgba(26,200,80,0.8)'
                      : '0 0 20px rgba(200,26,26,0.8)',
                  }}
                >
                  {isGood ? 'The Witness Walks Free' : 'The Witness Falls'}
                </p>
              </div>
            </div>
          </RecessedScreen>
        </ScreenLip>

        {/* Footer — verdict summary */}
        <div className="shrink-0 text-center">
          <p className="font-federo text-sm text-[#c8c8c8] opacity-60 tracking-wider">
            {isGood
              ? 'Testimony accepted. Operative file sealed.'
              : 'Testimony rejected. Operative file sealed.'}
          </p>
        </div>

        {/* Navigation */}
        <NavCluster
          onBack={onBack}
          backLabel="← Back"
          onRestart={onRestart}
        />

      </UnifiedConsole>
    </div>
  )
}

function EndingMedia({ media, isGood }) {
  if (!media) return null

  const glowColor = isGood ? 'rgba(26,200,80,0.15)' : 'rgba(200,26,26,0.15)'

  if (media.type === 'video') {
    return (
      <video
        src={media.url}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover relative z-10"
        aria-label={media.alt}
        style={{ filter: `drop-shadow(0 0 40px ${glowColor})` }}
      />
    )
  }

  return (
    <img
      src={media.url}
      alt={media.alt}
      className="w-full h-full object-cover relative z-10"
      style={{ filter: `brightness(0.85) saturate(1.2)` }}
    />
  )
}

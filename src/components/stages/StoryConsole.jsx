import UnifiedConsole from '../ui/UnifiedConsole'
import ScreenLip from '../ui/ScreenLip'
import RecessedScreen from '../ui/RecessedScreen'
import NavCluster from '../navigation/NavCluster'

/**
 * Stage 3 — The Witness
 * Single multi-windowed hardware unit.
 *
 * Layout:
 *   ┌──────────────────────────────────────────────┐
 *   │ [Profile] │ CHARACTER TITLE / ROLE            │  ← HEADER (carved into shell)
 *   ├────────┬───────────────────────┬──────────────┤
 *   │ Narr.  │   MAIN FEED (50%)     │  Mini ×4     │  ← BODY
 *   │ ~25%   │   aspect-video        │  right col   │
 *   ├────────┴───────────────────────┴──────────────┤
 *   │            ASSET TRAY (icons row)             │  ← FOOTER
 *   └─────────────────────────────[ NavCluster ] ───┘
 */
export default function StoryConsole({
  character,
  onBack,
  onVerdict,
  onPrev,
  onNext,
}) {
  if (!character) return null

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#1a0008] p-4">
      <UnifiedConsole className="w-full h-full max-w-[98vw] max-h-[96vh] flex flex-col gap-3 p-4 relative">

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div className="flex items-stretch gap-3 shrink-0 h-[14%]">

          {/* Profile image — carved recess */}
          <ScreenLip className="aspect-square h-full">
            <RecessedScreen className="w-full h-full">
              <img
                src={character.profileImage}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </RecessedScreen>
          </ScreenLip>

          {/* Title block — stamped on the plastic surface */}
          <div className="flex-1 flex flex-col justify-center px-4">
            <p className="font-federo text-[11px] tracking-[0.4em] text-[#e8a0a8] uppercase opacity-70 mb-1">
              Witness Protocol — Operative File
            </p>
            <h2 className="console-title text-3xl tracking-wide leading-tight">
              {character.name}
            </h2>
            <p className="font-federo text-sm tracking-widest text-[#c8f0c8] uppercase mt-1">
              {character.role}
            </p>
          </div>

          {/* Prev / Next character micro-controls on the header bar */}
          <div className="flex items-center gap-2 pr-2">
            <button
              onClick={onPrev}
              className="oval-btn oval-btn-purple text-xs px-3 py-1"
              aria-label="Previous operative"
            >
              ‹ Prev
            </button>
            <button
              onClick={onNext}
              className="oval-btn oval-btn-purple text-xs px-3 py-1"
              aria-label="Next operative"
            >
              Next ›
            </button>
          </div>
        </div>

        {/* ── BODY (3 columns) ───────────────────────────────────── */}
        <div className="flex gap-3 flex-1 min-h-0">

          {/* LEFT — Narrative text (~25%) */}
          <ScreenLip className="w-[24%] shrink-0 h-full">
            <RecessedScreen className="w-full h-full p-4 overflow-y-auto">
              <p className="screen-label text-[10px] tracking-[0.35em] uppercase mb-3 opacity-70">
                — Operative Account —
              </p>
              <p className="font-federo text-sm text-[#d8f0d8] leading-relaxed whitespace-pre-line">
                {character.narrativeText}
              </p>
            </RecessedScreen>
          </ScreenLip>

          {/* CENTER — Main feed (~50%), aspect-video, phosphor glow */}
          <ScreenLip className="flex-1 h-full flex items-center justify-center">
            <RecessedScreen
              phosphor
              className="w-full h-full flex items-center justify-center"
            >
              <MainFeedMedia media={character.mainFeedMedia} />
            </RecessedScreen>
          </ScreenLip>

          {/* RIGHT — 4 mini recesses ("The Others") */}
          <div className="w-[18%] shrink-0 flex flex-col gap-2 h-full">
            {character.thumbnailImages.map((thumb) => (
              <ScreenLip key={thumb.id} className="flex-1">
                <RecessedScreen className="w-full h-full relative">
                  <img
                    src={thumb.url}
                    alt={thumb.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-0.5 z-10">
                    <span className="font-federo text-[9px] text-[#c8f0c8] tracking-widest uppercase">
                      {thumb.caption}
                    </span>
                  </div>
                </RecessedScreen>
              </ScreenLip>
            ))}
          </div>

        </div>

        {/* ── FOOTER — Asset Tray ────────────────────────────────── */}
        <ScreenLip className="shrink-0 h-[13%]">
          <RecessedScreen className="w-full h-full flex items-center gap-4 px-5 overflow-x-auto">
            <span className="font-federo text-[10px] text-[#c8f0c8] tracking-[0.35em] uppercase opacity-60 shrink-0">
              Assets:
            </span>
            {character.assetTrayIcons.map((icon) => (
              <AssetIcon key={icon.id} icon={icon} />
            ))}
          </RecessedScreen>
        </ScreenLip>

        {/* ── NAVIGATION (bottom-right, absolute) ───────────────── */}
        <NavCluster
          onBack={onBack}
          backLabel="← Hall"
          onNext={onVerdict}
          nextLabel="Verdict ▶"
        />

      </UnifiedConsole>
    </div>
  )
}

/* ── Sub-components ─────────────────────────────────────────────── */

function MainFeedMedia({ media }) {
  if (!media) return null

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
      />
    )
  }

  return (
    <img
      src={media.url}
      alt={media.alt}
      className="w-full h-full object-cover relative z-10"
    />
  )
}

function AssetIcon({ icon }) {
  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <div className="w-12 h-12 rounded screen-lip overflow-hidden">
        <RecessedScreen className="w-full h-full">
          <img
            src={icon.url}
            alt={icon.label}
            className="w-full h-full object-cover"
          />
        </RecessedScreen>
      </div>
      <span className="font-federo text-[9px] text-[#c8f0c8] tracking-wider uppercase opacity-70">
        {icon.label}
      </span>
    </div>
  )
}

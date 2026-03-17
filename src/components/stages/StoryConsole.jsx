import { useState, useEffect, useRef } from 'react'
import UnifiedConsole from '../ui/UnifiedConsole'
import ScreenLip from '../ui/ScreenLip'
import RecessedScreen from '../ui/RecessedScreen'
import NavCluster from '../navigation/NavCluster'
import OvalButton from '../ui/OvalButton'
import { characters, assetTrayIcons } from '../../data/characters'

/**
 * Stage 3 — The Witness
 * UnifiedConsole owns centering and 4:3 ratio.
 * Layout: header 14% | 3-col body flex-1 | asset tray 13%
 */
export default function StoryConsole({
  character,
  onBack,
  onVerdict,
  onPrev,
  onNext,
  collectedIds = [],
  onCollect,
}) {
  const [activeAsset, setActiveAsset] = useState(null)
  const [typedText, setTypedText] = useState('')
  const [videoProgress, setVideoProgress] = useState(0)
  const [videoTime, setVideoTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const mainVideoRef = useRef(null)

  const toggleMainVideo = () => {
    const v = mainVideoRef.current
    if (!v) return
    if (isVideoPlaying) { v.pause() } else { v.play() }
  }

  const isCollected = collectedIds.includes(character?.id)

  // Derive which asset-tray slots are unlocked from the global collectedIds
  const unlockedAssetIndices = new Set(
    characters
      .filter((c) => collectedIds.includes(c.id) && c.unlocksAssetIndex != null)
      .map((c) => c.unlocksAssetIndex)
  )
  const otherChars = characters.filter((c) => c.id !== character?.id)
  const currentCharGlobalIdx = characters.findIndex((c) => c.id === character?.id)

  // Reset all local state when the character changes
  useEffect(() => {
    setActiveAsset(null)
    setTypedText('')
    setVideoProgress(0)
    setVideoTime(0)
    setVideoDuration(0)
    setIsVideoPlaying(false)
  }, [character?.id])

  const handleVideoSeek = (e) => {
    const v = mainVideoRef.current
    if (!v) return
    const bar = e.currentTarget
    const ratio = (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth
    v.currentTime = Math.max(0, Math.min(1, ratio)) * v.duration
  }

  // Typewriter effect — runs whenever a new asset is activated
  useEffect(() => {
    if (!activeAsset || !character?.narrativeText) return
    setTypedText('')
    let i = 0
    const text = character.narrativeText
    const timer = setInterval(() => {
      i++
      setTypedText(text.slice(0, i))
      if (i >= text.length) clearInterval(timer)
    }, 80)
    return () => clearInterval(timer)
  }, [activeAsset, character?.narrativeText])

  const handleAssetClick = (iconId, idx) => {
    if (!unlockedAssetIndices.has(idx)) return
    setActiveAsset(iconId)
  }

  if (!character) return null

  return (
    <UnifiedConsole className="flex flex-col gap-3 p-4">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div className="flex items-stretch gap-3 shrink-0 h-[14%] pl-[12%]">

        {/* Profile image — carved recess */}
        <ScreenLip className={`${character.profileAspectClass ?? 'aspect-square'} h-full`}>
          <RecessedScreen className="w-full h-full">
            <img
              src={character.profileImage}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          </RecessedScreen>
        </ScreenLip>

        {/* Title block — stamped on the plastic surface */}
        <div className="flex-1 flex flex-col justify-center px-[1.5%]">
          <h2 className="console-title text-[clamp(14px,2.5vmin,30px)] tracking-wide leading-tight">
            {character.name}
          </h2>
        </div>

      </div>

      {/* ── BODY (3 columns) ───────────────────────────────────── */}
      <div className="flex gap-3 flex-1 min-h-0">

        {/* LEFT — Square slot + Narrative / Typewriter text */}
        <div className="w-[calc(20%-45px)] shrink-0 h-full flex flex-col gap-2 ml-[10px]">

          {/* Square decorative slot — auto-play muted video loop */}
          <ScreenLip className="w-full aspect-square shrink-0">
            <RecessedScreen flat className="w-full h-full overflow-hidden">
              <video
                src={character.decorativeVideo}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            </RecessedScreen>
          </ScreenLip>

          {/* Text panel — static narrative or typewriter when asset is active */}
          <ScreenLip className="flex-1 min-h-0 mt-[2vmin] mb-[30px]" style={{ boxShadow: 'inset 6px 4px 12px 0px rgba(86, 41, 59, 0.5), -6px -5px 5px 0px rgba(74, 33, 47, 0.5), -5px -4px 6px 0px rgba(80, 33, 33, 0.6)' }}>
            <RecessedScreen flat className="w-full h-full p-[1.5vmin]">
              <div className="overflow-y-auto h-full">
                <p className="screen-label text-[10px] tracking-[0.35em] uppercase mb-3 opacity-70 text-center">
                  — DREAM NOTE —
                </p>
                <p className="font-federo text-[clamp(8px,1.2vmin,14px)] text-[#e692b1] leading-relaxed whitespace-pre-line mt-[2vmin]">
                  {activeAsset ? (
                    <>
                      {typedText}
                      <span className="animate-pulse opacity-80">▌</span>
                    </>
                  ) : (
                    'Full Neural Sync Required. Complete the sequence to unlock Meanwhile fragments and Character Assets.Remember to touch the Assets to reveal the Dream Notes.'
                  )}
                </p>
              </div>
            </RecessedScreen>
          </ScreenLip>

        </div>

        {/* CENTER — Main feed, 4:3 sized to content */}
        <ScreenLip className="flex-1 min-w-0 self-start mr-[20px] mt-[15px] ml-[20px]" style={{ padding: '10px' }}>
          <div className="w-full aspect-[4/3]">
            <RecessedScreen
              phosphor
              className="w-full h-full flex items-center justify-center"
            >
              <MainFeedMedia
                key={character.id}
                media={character.mainFeedMedia}
                onEnded={() => onCollect?.(character.id)}
                videoRef={mainVideoRef}
                onProgress={(t, d) => {
                  setVideoTime(t)
                  setVideoDuration(d)
                  setVideoProgress(d ? (t / d) * 100 : 0)
                }}
                onPlayStateChange={setIsVideoPlaying}
              />
            </RecessedScreen>
          </div>

          {/* Progress bar — below the video grid, inside the ScreenLip padding */}
          {character.mainFeedMedia?.type === 'video' && (
            <div className="w-full flex items-center gap-3 mt-2 px-1">
              <OvalButton
                variant="purple"
                size="sm"
                icon={isVideoPlaying ? 'pause' : 'play'}
                onClick={toggleMainVideo}
                style={{ width: '20px', height: '20px' }}
              />
              <div
                className="flex-1 h-2 rounded-full cursor-pointer overflow-hidden"
                style={{
                  background: 'rgba(0,0,0,0.55)',
                  boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.9), inset -1px -1px 3px rgba(255,255,255,0.06)',
                }}
                onClick={handleVideoSeek}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${videoProgress}%`,
                    background: 'linear-gradient(90deg, #b83060 0%, #e87070 100%)',
                    boxShadow: '0 0 8px rgba(184,48,96,0.7)',
                    transition: 'width 0.1s linear',
                  }}
                />
              </div>
              <span className="font-federo text-[10px] tracking-widest text-[#e8a0a8] opacity-70 shrink-0">
                {formatTime(videoTime)} / {formatTime(videoDuration)}
              </span>
            </div>
          )}
        </ScreenLip>

        {/* RIGHT — 4 mini recesses ("The Others") */}
        <div className="w-[19.8%] shrink-0 flex flex-col gap-2 h-full relative -top-[21%] right-[0.8%]">
          {otherChars.map((otherChar, idx) => {
            const otherCharGlobalIdx = characters.findIndex((c) => c.id === otherChar.id)
            const thumbIdx = currentCharGlobalIdx < otherCharGlobalIdx
              ? currentCharGlobalIdx
              : currentCharGlobalIdx - 1
            const thumb = otherChar.thumbnailImages[thumbIdx]
            return (
            <div key={otherChar.id} className="relative w-full pb-[75%] shrink-0">
              <div className="absolute inset-0">
                <ScreenLip className="w-full h-full" style={{ boxShadow: '-6px -5px 5px 0px rgba(108, 51, 73, 0.5), -5px -4px 6px 0px rgba(134, 45, 62, 0.6)' }}>
                  <RecessedScreen flat className="w-full h-full relative overflow-hidden" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.5)' }}>
                    <ThumbnailSlot
                      thumb={thumb}
                      avatarSrc={otherChar.thumbnailImage}
                      avatarAlt={otherChar.name}
                      unlocked={isCollected}
                    />
                  </RecessedScreen>
                </ScreenLip>
              </div>
            </div>
            )
          })}
        </div>

      </div>

      {/* ── FOOTER — Asset Tray ────────────────────────────────── */}
      <ScreenLip className="shrink-0 h-[calc(18%-20px)] ml-[calc(2.5%+15px)] mr-[22.8%] relative -top-[1%]">
        <RecessedScreen flat className="w-full h-full" style={{ background: '#ee8baf' }}>
          <div className="flex items-center justify-evenly w-full h-full">
            {assetTrayIcons.map((icon, idx) => (
              <AssetIcon
                key={icon.id}
                icon={icon}
                isLit={unlockedAssetIndices.has(idx)}
                isActive={activeAsset === icon.id}
                onClick={() => handleAssetClick(icon.id, idx)}
              />
            ))}
          </div>
        </RecessedScreen>
      </ScreenLip>

      {/* ── NAVIGATION (bottom-right, absolute) ───────────────── */}
      <NavCluster
        onBack={onBack}
        onNext={onVerdict}
        onPrevChar={onPrev}
        onNextChar={onNext}
      />

    </UnifiedConsole>
  )
}

/* ── Sub-components ─────────────────────────────────────────────── */

function MainFeedMedia({ media, onEnded, videoRef: externalRef, onProgress, onPlayStateChange }) {
  const internalRef = useRef(null)
  const videoRef = externalRef ?? internalRef
  const [isPlaying, setIsPlaying] = useState(false)

  const setPlaying = (val) => {
    setIsPlaying(val)
    onPlayStateChange?.(val)
  }

  if (!media) return null

  if (media.type === 'video') {
    const handlePlay = () => {
      videoRef.current?.play()
      setPlaying(true)
    }

    return (
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          src={media.url}
          loop={false}
          playsInline
          onEnded={onEnded}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={() => {
            const v = videoRef.current
            if (v && onProgress) onProgress(v.currentTime, v.duration)
          }}
          onLoadedMetadata={() => {
            const v = videoRef.current
            if (v && onProgress) onProgress(0, v.duration)
          }}
          className="w-full h-full object-cover relative z-10"
          aria-label={media.alt}
        />
        {!isPlaying && (
          <div className="absolute bottom-5 left-0 right-0 flex justify-center z-20">
            <OvalButton variant="red" size="sm" icon="play" onClick={handlePlay} />
          </div>
        )}
      </div>
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

function ThumbnailSlot({ thumb, avatarSrc, avatarAlt, unlocked }) {
  const [revealed, setRevealed] = useState(false)
  const videoRef = useRef(null)

  const handleEnter = () => { if (unlocked) setRevealed(true) }
  const handleLeave = () => { if (unlocked) setRevealed(false) }
  const handleClick = () => { if (unlocked) setRevealed((r) => !r) }

  // Keep video playing regardless of reveal state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  return (
    <div
      className="absolute inset-0 w-full h-full"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      style={{ cursor: unlocked ? 'pointer' : 'default' }}
    >
      {/* Video layer — always present beneath, loop + muted */}
      {thumb.type === 'video' ? (
        <video
          ref={videoRef}
          src={thumb.url}
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img
          src={thumb.url}
          alt={thumb.caption}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Avatar layer — slides up on reveal */}
      <img
        src={avatarSrc}
        alt={avatarAlt}
        className="absolute inset-0 w-full h-full object-cover z-10"
        style={{
          transform: revealed ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.5s ease',
        }}
      />

      {/* Name label — always visible; slides down when unlocked + revealed */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 pb-2 text-center"
        style={{
          transform: (unlocked && revealed) ? 'translateY(100%)' : 'translateY(0)',
          transition: unlocked ? 'transform 0.3s ease' : 'none',
        }}
      >
        <p className="font-amarante text-xs text-white leading-tight tracking-wide drop-shadow-lg">
          {avatarAlt}
        </p>
      </div>
    </div>
  )
}

function AssetIcon({ icon, isLit, isActive, onClick }) {
  return (
    <div
      className="flex flex-col items-center gap-1 shrink-0 select-none"
      onClick={isLit ? onClick : undefined}
      style={{
        cursor: isLit ? 'pointer' : 'default',
        filter: isLit
          ? 'grayscale(0) brightness(1.2) drop-shadow(0 0 10px red)'
          : 'grayscale(1) brightness(0.5)',
        transition: 'filter 0.4s ease',
        outline: 'none',
      }}
    >
      <img
        src={icon.url}
        alt={icon.label}
        className="h-[9vmin] w-auto object-contain"
      />
    </div>
  )
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

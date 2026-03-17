import { useRef, useState, useCallback } from 'react'
import OvalButton from '../ui/OvalButton'
import { transitionVideoUrl } from '../../data/characters'

/**
 * Stage 1.5 — Intro Transition
 * Fullscreen video (fixed, covers entire viewport) — no UnifiedConsole frame.
 * Triggered by user gesture on Landing, so audio autoplay is permitted.
 * Auto-advances to selection when playback ends.
 * Controls: progress bar + play/pause (bottom bar), home + skip (bottom-right).
 */
export default function IntroVideo({ onComplete, onSkip, onHome }) {
  const videoRef                      = useRef(null)
  const [isPlaying, setIsPlaying]     = useState(true)
  const [progress, setProgress]       = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration]       = useState(0)

  const handlePlay  = useCallback(() => setIsPlaying(true),  [])
  const handlePause = useCallback(() => setIsPlaying(false), [])

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current
    if (!v || !v.duration) return
    setCurrentTime(v.currentTime)
    setProgress((v.currentTime / v.duration) * 100)
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    setDuration(videoRef.current?.duration ?? 0)
  }, [])

  const handleEnded = useCallback(() => {
    onComplete()
  }, [onComplete])

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    isPlaying ? v.pause() : v.play()
  }, [isPlaying])

  const handleSeek = useCallback((e) => {
    const v = videoRef.current
    if (!v) return
    const bar   = e.currentTarget
    const ratio = (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth
    v.currentTime = Math.max(0, Math.min(1, ratio)) * v.duration
  }, [])

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black z-50">

      {/* Fullscreen transition video */}
      <video
        ref={videoRef}
        src={transitionVideoUrl}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Home + Skip buttons — bottom-right, above controls bar */}
      <div
        className="absolute z-30 flex gap-3"
        style={{ bottom: 'calc(3% + 68px)', right: '3%' }}
      >
        <OvalButton variant="red"   size="sm" icon="home" onClick={onHome} />
        <OvalButton variant="green" size="sm" icon="next" iconStyle={{ opacity: 0 }} onClick={onSkip} />
      </div>

      {/* Controls bar — bottom strip with gradient scrim */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 flex items-center gap-4 px-8 py-4"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.40) 70%, transparent 100%)',
        }}
      >
        {/* Play / Pause */}
        <OvalButton
          variant="purple"
          size="sm"
          icon={isPlaying ? 'pause' : 'play'}
          onClick={togglePlay}
        />

        {/* Progress track */}
        <div
          className="flex-1 h-3 rounded-full cursor-pointer overflow-hidden shrink"
          style={{
            background: 'rgba(0,0,0,0.55)',
            boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.9), inset -1px -1px 3px rgba(255,255,255,0.06)',
            minWidth: 0,
          }}
          onClick={handleSeek}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #b83060 0%, #e87070 100%)',
              boxShadow: '0 0 8px rgba(184,48,96,0.7)',
              transition: 'width 0.1s linear',
            }}
          />
        </div>

        {/* Timecode */}
        <span
          className="font-federo text-[10px] tracking-widest text-[#e8a0a8] opacity-70 shrink-0"
          style={{ minWidth: '5ch' }}
        >
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

    </div>
  )
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

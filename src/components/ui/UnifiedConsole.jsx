import { useRef, useEffect } from 'react'
import { PC98Engine } from '../../PC98_VisualEngine'

/**
 * UnifiedConsole
 * The Master Shell — owns full-screen centering, enforces 4:3 aspect ratio,
 * and renders the red plastic hardware surface. One instance per stage.
 * Media and controls are carved INTO it, not wrapped individually.
 *
 * Background pipeline:
 *  1. A hidden <video> plays /bg-moving.mp4 as the pixel source.
 *  2. Each rAF tick, the current frame is drawn into a 128×96 offscreen
 *     canvas that clips with ctx.roundRect() — matching the 70px CSS radius
 *     scaled down proportionally.
 *  3. The offscreen canvas is upscaled onto the display canvas using
 *     imageSmoothingEnabled=false (nearest-neighbour), producing natural
 *     stair-step pixelation on the rounded corners.
 *  4. A future dithering pass can be applied to the display canvas ctx
 *     without ever touching DOM text nodes.
 */

const SMALL_W = 128
const SMALL_H = 96   // 4:3 ratio
const CSS_RADIUS = 70 // mirrors .unified-console border-radius

export default function UnifiedConsole({ children, className = '', style }) {
  const videoRef  = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d')

    // Offscreen low-res canvas — clipping + video frame happen here
    const offscreen = document.createElement('canvas')
    offscreen.width  = SMALL_W
    offscreen.height = SMALL_H
    const octx = offscreen.getContext('2d', { willReadFrequently: true })

    // Keep display canvas pixel dimensions in sync with its CSS layout size
    const syncSize = () => {
      canvas.width  = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
    syncSize()
    const ro = new ResizeObserver(syncSize)
    ro.observe(canvas)

    let rafId

    const draw = () => {
      rafId = requestAnimationFrame(draw)

      if (video.readyState < 2) return

      const cw = canvas.width
      const ch = canvas.height
      if (!cw || !ch) return

      // Scale the 70px CSS border-radius down to the offscreen canvas size
      const radius = CSS_RADIUS * (SMALL_W / cw)

      // ── Offscreen: clip + draw video frame ──────────────────────────
      octx.clearRect(0, 0, SMALL_W, SMALL_H)
      octx.save()
      octx.beginPath()
      octx.roundRect(0, 0, SMALL_W, SMALL_H, radius)
      octx.clip()
      octx.drawImage(video, 0, 0, SMALL_W, SMALL_H)
      octx.restore()

      // ── PC98 pixel filter on the clipped offscreen frame ─────────────
      const frame = octx.getImageData(0, 0, SMALL_W, SMALL_H)
      PC98Engine.processImageData(frame, { palette: 'pc98', pattern: 'bayer4', strength: 40 })
      octx.putImageData(frame, 0, 0)

      // ── Display canvas: upscale with nearest-neighbour ───────────────
      // imageSmoothingEnabled resets to true whenever canvas dimensions
      // change (via ResizeObserver), so we set it before every draw.
      ctx.clearRect(0, 0, cw, ch)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(offscreen, 0, 0, cw, ch)
    }

    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [])

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[rgba(10,16,10,1)]">
      <div
        className={`unified-console flex flex-col relative ${className}`}
        style={{
          width: 'min(90vw, calc(90vh * 4 / 3))',
          aspectRatio: '4 / 3',
          ...style,
        }}
      >
        {/* Pixel source — kept off-screen, never rendered directly */}
        <video
          ref={videoRef}
          src="/bg-moving.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ display: 'none' }}
        />

        {/* Display canvas — shows the low-res-clipped, nearest-neighbour-upscaled frame */}
        <canvas ref={canvasRef} className="console-bg-canvas" />

        {children}
      </div>
    </div>
  )
}

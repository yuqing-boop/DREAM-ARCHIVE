/**
 * UnifiedConsole
 * The Master Shell — owns full-screen centering, enforces 4:3 aspect ratio,
 * and renders the red plastic hardware surface. One instance per stage.
 * Media and controls are carved INTO it, not wrapped individually.
 */
export default function UnifiedConsole({ children, className = '', style }) {
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
        <video
          src="/bg-moving.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="console-bg-video"
        />
        {children}
      </div>
    </div>
  )
}

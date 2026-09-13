import { useEffect, useRef, useState } from 'react'

type Props = {
  backgroundImage: string
  characterImage: string
  replyText: string
  isTyping: boolean
  voiceEnabled: boolean
  onToggleVoice: () => void
  t: Record<string, string>
}

function resolveImage(src: string) {
  if (!src) return ''
  if (src.startsWith('data:')) return src
  return `/src/assets/${src}`
}

export default function ScenePanel({
  backgroundImage,
  characterImage,
  replyText,
  isTyping,
  voiceEnabled,
  onToggleVoice,
  t,
}: Props) {
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('characterPosition')
    return saved ? JSON.parse(saved) : { x: 0, y: 0 }
  })

  const [scale, setScale] = useState(() => {
    const saved = localStorage.getItem('characterScale')
    return saved ? Number(saved) : 1
  })

  const [placing, setPlacing] = useState(false)
  const offsetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    localStorage.setItem('characterPosition', JSON.stringify(position))
  }, [position])

  useEffect(() => {
    localStorage.setItem('characterScale', String(scale))
  }, [scale])

  function handleWheel(event: React.WheelEvent) {
    const delta = event.deltaY > 0 ? -0.05 : 0.05
    setScale((prev) => Math.min(3, Math.max(0.3, prev + delta)))
  }

  useEffect(() => {
    if (!placing) return

    function handleMouseMove(event: MouseEvent) {
      setPosition({
        x: event.clientX - offsetRef.current.x,
        y: event.clientY - offsetRef.current.y,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [placing])

  function handleCharacterDoubleClick(event: React.MouseEvent) {
    event.stopPropagation()

    offsetRef.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    }

    setPlacing(true)
  }

  function handleSceneClick() {
    if (placing) {
      setPlacing(false)
    }
  }

  return (
    <section className="scene-panel" onClick={handleSceneClick} onWheel={handleWheel}>
      <div
        className="scene-background"
        style={
          backgroundImage
            ? { backgroundImage: `url(${resolveImage(backgroundImage)})` }
            : undefined
        }
      />

      <button
        type="button"
        className="scene-voice-toggle"
        onClick={onToggleVoice}
        title={voiceEnabled ? t.voiceOn : t.voiceOff}
      >
        {voiceEnabled ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        )}
      </button>

      {replyText && (
        <div className="scene-reply">
          <p>{replyText}</p>
        </div>
      )}

      {characterImage && (
        <div
          className="scene-character"
          style={{
            left: 0,
            top: 0,
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: placing ? 'crosshair' : 'pointer',
            userSelect: 'none',
          }}
          onDoubleClick={handleCharacterDoubleClick}
        >
          <img src={resolveImage(characterImage)} alt="Character" />
        </div>
      )}
    </section>
  )
}
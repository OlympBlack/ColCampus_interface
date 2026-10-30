import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { UiIcon } from './UiIcons'

interface AudioMessagePlayerProps {
  src: string
  duration?: number | null
  isMine: boolean
}

function formatTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export function AudioMessagePlayer({ src, duration, isMine }: AudioMessagePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const waveSurferRef = useRef<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(duration ?? 0)
  const [isLoading, setIsLoading] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!containerRef.current || !src) return

    let ws: WaveSurfer | null = null

    try {
      ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor: isMine ? 'rgba(255, 255, 255, 0.45)' : '#cbd5e1',
        progressColor: isMine ? '#ffffff' : '#a4c639',
        cursorWidth: 0,
        barWidth: 2,
        barGap: 2,
        barRadius: 2,
        height: 28,
        normalize: true,
        url: src,
      })

      waveSurferRef.current = ws

      ws.on('ready', () => {
        setIsLoading(false)
        const d = ws?.getDuration() ?? duration ?? 0
        setTotalDuration(d)
      })

      ws.on('play', () => setIsPlaying(true))
      ws.on('pause', () => setIsPlaying(false))
      ws.on('finish', () => {
        setIsPlaying(false)
        setCurrentTime(0)
      })

      ws.on('timeupdate', (currentTime) => {
        setCurrentTime(currentTime)
      })

      ws.on('error', (err) => {
        console.warn('WaveSurfer loading error:', err)
        setIsLoading(false)
        setHasError(true)
      })
    } catch (e) {
      console.warn('WaveSurfer init error:', e)
      setHasError(true)
      setIsLoading(false)
    }

    return () => {
      try {
        ws?.destroy()
      } catch {
        // ignore cleanup error
      }
    }
  }, [src, isMine, duration])

  const togglePlay = () => {
    if (!waveSurferRef.current) return
    waveSurferRef.current.playPause()
  }

  const cycleSpeed = () => {
    if (!waveSurferRef.current) return
    const nextRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1
    waveSurferRef.current.setPlaybackRate(nextRate)
    setPlaybackRate(nextRate)
  }

  if (hasError) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
        <audio controls src={src} style={{ maxHeight: 36, maxWidth: 220 }} />
      </div>
    )
  }

  const buttonBg = isMine ? 'rgba(255, 255, 255, 0.25)' : '#a4c639'
  const buttonColor = '#ffffff'
  const textColor = isMine ? 'rgba(255, 255, 255, 0.9)' : '#64748b'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
        minWidth: '210px',
        maxWidth: '260px',
        padding: '2px 0',
      }}
    >
      <button
        type="button"
        onClick={togglePlay}
        disabled={isLoading}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: buttonBg,
          color: buttonColor,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isLoading ? 'default' : 'pointer',
          flexShrink: 0,
          transition: 'all 0.15s ease',
          boxShadow: isMine ? 'none' : '0 2px 6px rgba(164, 198, 57, 0.3)',
        }}
        title={isPlaying ? 'Pause' : 'Écouter'}
      >
        {isLoading ? (
          <span
            style={{
              width: 14,
              height: 14,
              border: '2px solid rgba(255,255,255,0.4)',
              borderTopColor: '#ffffff',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.8s linear infinite',
            }}
          />
        ) : isPlaying ? (
          <UiIcon name="pause" />
        ) : (
          <UiIcon name="play" />
        )}
      </button>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div ref={containerRef} style={{ width: '100%', height: 28, cursor: 'pointer' }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: textColor,
            fontWeight: 600,
            padding: '0 2px',
          }}
        >
          <span>{formatTime(isPlaying ? currentTime : (totalDuration || currentTime))}</span>
          <button
            type="button"
            onClick={cycleSpeed}
            style={{
              background: isMine ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
              border: 'none',
              borderRadius: '6px',
              padding: '1px 5px',
              fontSize: '10px',
              fontWeight: 700,
              color: isMine ? '#ffffff' : '#475569',
              cursor: 'pointer',
            }}
            title="Vitesse de lecture"
          >
            {playbackRate}x
          </button>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { UiIcon } from './UiIcons'
import { API_BASE_URL } from '../services/api'

interface AudioMessagePlayerProps {
  src: string
  duration?: number | null
  isMine: boolean
}

export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('blob:') || url.startsWith('data:')) return url

  if (url.startsWith('/storage/') || url.startsWith('storage/')) {
    const clean = url.startsWith('/') ? url : `/${url}`
    const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '')
    return `${apiOrigin}${clean}`
  }

  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && url.includes('localhost:8000')) {
    const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '')
    return url.replace(/https?:\/\/localhost:8000/, apiOrigin)
  }

  return url
}

function formatTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export function AudioMessagePlayer({ src, duration, isMine }: AudioMessagePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const waveSurferRef = useRef<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(duration ?? 0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isBuffering, setIsBuffering] = useState(false)

  const resolvedSrc = resolveMediaUrl(src)

  useEffect(() => {
    if (!containerRef.current || !audioRef.current || !resolvedSrc) return

    let ws: WaveSurfer | null = null

    try {
      ws = WaveSurfer.create({
        container: containerRef.current,
        media: audioRef.current,
        waveColor: isMine ? 'rgba(255, 255, 255, 0.45)' : '#cbd5e1',
        progressColor: isMine ? '#ffffff' : '#a4c639',
        cursorWidth: 0,
        barWidth: 2,
        barGap: 2,
        barRadius: 2,
        height: 28,
        normalize: true,
      })

      waveSurferRef.current = ws

      ws.on('play', () => setIsPlaying(true))
      ws.on('pause', () => setIsPlaying(false))
      ws.on('finish', () => {
        setIsPlaying(false)
        setCurrentTime(0)
      })
      ws.on('timeupdate', (t) => {
        setCurrentTime(t)
      })
    } catch (e) {
      console.warn('WaveSurfer initialization fallback:', e)
    }

    return () => {
      try {
        ws?.destroy()
      } catch {
        // ignore
      }
    }
  }, [resolvedSrc, isMine])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      setIsBuffering(true)
      audioRef.current.play()
        .then(() => setIsBuffering(false))
        .catch((err) => {
          console.warn('Playback play() catch:', err)
          setIsBuffering(false)
        })
    }
  }

  const cycleSpeed = () => {
    const nextRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate
    }
    if (waveSurferRef.current) {
      try {
        waveSurferRef.current.setPlaybackRate(nextRate)
      } catch {
        // ignore
      }
    }
    setPlaybackRate(nextRate)
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
      <audio
        ref={audioRef}
        src={resolvedSrc}
        preload="metadata"
        onPlay={() => {
          setIsPlaying(true)
          setIsBuffering(false)
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false)
          setCurrentTime(0)
        }}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current && (!totalDuration || totalDuration <= 0)) {
            setTotalDuration(audioRef.current.duration)
          }
          setIsBuffering(false)
        }}
        onWaiting={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
      />

      <button
        type="button"
        onClick={togglePlay}
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
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.15s ease',
          boxShadow: isMine ? 'none' : '0 2px 6px rgba(164, 198, 57, 0.3)',
        }}
        title={isPlaying ? 'Pause' : 'Écouter'}
      >
        {isBuffering ? (
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

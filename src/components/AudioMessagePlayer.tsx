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

  let finalUrl = url
  if (finalUrl.startsWith('/storage/') || finalUrl.startsWith('storage/')) {
    const clean = finalUrl.startsWith('/') ? finalUrl : `/${finalUrl}`
    const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '')
    finalUrl = `${apiOrigin}${clean}`
  }

  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && finalUrl.includes('localhost:8000')) {
    const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '')
    finalUrl = finalUrl.replace(/https?:\/\/localhost:8000/, apiOrigin)
  }

  // Force HTTPS sur production si la page est en HTTPS (évite les erreurs Mixed Content du navigateur)
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && finalUrl.startsWith('http://')) {
    finalUrl = finalUrl.replace('http://', 'https://')
  }

  return finalUrl
}

function formatTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0 || !isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export function AudioMessagePlayer({ src, duration, isMine }: AudioMessagePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const waveSurferRef = useRef<WaveSurfer | null>(null)
  const playerIdRef = useRef<string>(Math.random().toString(36).substring(2, 9))
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState<number>(() => {
    if (duration && isFinite(duration) && duration > 0) return duration
    return 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [hasError, setHasError] = useState(false)

  const resolvedSrc = resolveMediaUrl(src)

  // Écoute de l'événement global pour mettre en pause dès qu'un autre audio démarre
  useEffect(() => {
    const handleStopAll = (e: Event) => {
      const custom = e as CustomEvent<{ senderId: string }>
      if (custom.detail?.senderId !== playerIdRef.current) {
        if (waveSurferRef.current && waveSurferRef.current.isPlaying()) {
          waveSurferRef.current.pause()
          setIsPlaying(false)
        }
      }
    }
    window.addEventListener('colcampus:stop-all-audios', handleStopAll)
    return () => window.removeEventListener('colcampus:stop-all-audios', handleStopAll)
  }, [])

  useEffect(() => {
    if (!containerRef.current || !resolvedSrc) return

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
        url: resolvedSrc,
      })

      waveSurferRef.current = ws

      ws.on('ready', () => {
        setIsLoading(false)
        const d = ws?.getDuration() ?? duration ?? 0
        if (isFinite(d) && d > 0) {
          setTotalDuration(d)
        } else if (duration && isFinite(duration) && duration > 0) {
          setTotalDuration(duration)
        }
      })

      ws.on('play', () => setIsPlaying(true))
      ws.on('pause', () => setIsPlaying(false))
      ws.on('finish', () => {
        setIsPlaying(false)
        setCurrentTime(0)
      })

      ws.on('timeupdate', (time) => {
        if (isFinite(time)) {
          setCurrentTime(time)
        }
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
  }, [resolvedSrc, isMine, duration])

  const togglePlay = () => {
    if (!waveSurferRef.current) return
    if (isPlaying) {
      waveSurferRef.current.pause()
    } else {
      // Met en pause tout autre audio en cours de lecture dans la messagerie
      window.dispatchEvent(
        new CustomEvent('colcampus:stop-all-audios', {
          detail: { senderId: playerIdRef.current },
        })
      )
      waveSurferRef.current.play()
    }
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
        <audio controls src={resolvedSrc} style={{ maxHeight: 36, maxWidth: 220 }} />
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
        <div
          ref={containerRef}
          style={{
            width: '100%',
            height: 28,
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
          }}
        />
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

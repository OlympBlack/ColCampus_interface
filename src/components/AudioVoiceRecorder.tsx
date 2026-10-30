import { useEffect, useRef, useState } from 'react'
import { UiIcon } from './UiIcons'

interface AudioVoiceRecorderProps {
  onSend: (audioBlob: Blob, duration: number) => void
  onCancel: () => void
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export function AudioVoiceRecorder({ onSend, onCancel }: AudioVoiceRecorderProps) {
  const [recordingTime, setRecordingTime] = useState(0)
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number>(0)
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let isCancelled = false

    const startRecording = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setPermissionError("L'enregistrement vocal n'est pas pris en charge par ce navigateur.")
          return
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        if (isCancelled) {
          stream.getTracks().forEach(t => t.stop())
          return
        }

        streamRef.current = stream
        audioChunksRef.current = []

        // Choose best mimeType supported by browser (iOS Safari prefers mp4/aac, Chrome prefers webm)
        let mimeType = ''
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus'
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm'
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4'
        } else if (MediaRecorder.isTypeSupported('audio/aac')) {
          mimeType = 'audio/aac'
        }

        const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
        mediaRecorderRef.current = recorder

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data)
          }
        }

        recorder.start(100) // chunk every 100ms
        startTimeRef.current = Date.now()

        timerIntervalRef.current = setInterval(() => {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
          setRecordingTime(elapsed)
        }, 1000)
      } catch (err: any) {
        console.error('Erreur acces micro:', err)
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setPermissionError("Accès au micro refusé. Veuillez autoriser le micro dans votre navigateur.")
        } else {
          setPermissionError("Impossible d'accéder au micro.")
        }
      }
    }

    void startRecording()

    return () => {
      isCancelled = true
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  const handleStopAndSend = () => {
    const recorder = mediaRecorderRef.current
    if (!recorder || recorder.state === 'inactive') {
      onCancel()
      return
    }

    const duration = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000))

    recorder.onstop = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
      const mimeType = recorder.mimeType || 'audio/webm'
      const blob = new Blob(audioChunksRef.current, { type: mimeType })
      if (blob.size > 0) {
        onSend(blob, duration)
      } else {
        onCancel()
      }
    }

    recorder.stop()
  }

  const handleCancel = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = null
      mediaRecorderRef.current.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
    }
    onCancel()
  }

  if (permissionError) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '8px 14px',
          background: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: 14,
          width: '100%',
          fontSize: '12.5px',
          color: '#b91c1c',
        }}
      >
        <span>{permissionError}</span>
        <button
          type="button"
          onClick={handleCancel}
          style={{
            border: 'none',
            background: 'transparent',
            color: '#b91c1c',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          Fermer
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        backgroundColor: '#f8fafc',
        borderRadius: '16px',
        padding: '6px 14px',
        border: '1.5px solid #e2e8f0',
        animation: 'fadeIn 0.2s ease-in-out',
      }}
    >
      {/* Bouton Annuler / Poubelle */}
      <button
        type="button"
        onClick={handleCancel}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#fee2e2',
          color: '#ef4444',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'transform 0.15s ease',
        }}
        title="Annuler le message vocal"
      >
        <UiIcon name="trash" />
      </button>

      {/* Indicateur enregistrement & durée */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <span
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            display: 'inline-block',
            animation: 'pulse 1s infinite',
          }}
        />
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
          {formatTime(recordingTime)}
        </span>
      </div>

      {/* Animation d'ondes sonores en direct */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', height: '24px' }}>
        {[40, 70, 30, 90, 60, 100, 45, 80, 50, 75, 35, 65, 85].map((h, i) => (
          <span
            key={i}
            style={{
              width: '3px',
              height: `${Math.max(6, (h * Math.sin((recordingTime * 2) + i)) % 22 + 8)}px`,
              backgroundColor: '#a4c639',
              borderRadius: '2px',
              transition: 'height 0.15s ease',
            }}
          />
        ))}
      </div>

      {/* Bouton Envoyer le vocal */}
      <button
        type="button"
        onClick={handleStopAndSend}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '14px',
          backgroundColor: '#a4c639',
          color: '#ffffff',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(164, 198, 57, 0.35)',
          transition: 'transform 0.15s ease',
        }}
        title="Envoyer le message vocal"
      >
        <UiIcon name="send" />
      </button>
    </div>
  )
}

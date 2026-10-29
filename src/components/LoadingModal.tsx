import { useEffect } from 'react'

interface LoadingModalProps {
  open: boolean
  title?: string
  message?: string
  progress?: number
}

export function LoadingModal({
  open,
  title = 'Chargement en cours...',
  message = 'Veuillez patienter pendant le traitement.',
  progress,
}: LoadingModalProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) {
    return null
  }

  const hasProgress = typeof progress === 'number' && Number.isFinite(progress)
  const safeProgress = hasProgress ? Math.min(100, Math.max(0, progress)) : 0

  return (
    <div className={'modal-layer z-[110] bg-slate-950/45 backdrop-blur-sm'} role={'presentation'}>
      <div className={'modal-backdrop'} />

      <section
        className={'modal-card w-[min(420px,calc(100vw-32px))] text-center'}
        role={'dialog'}
        aria-modal={'true'}
        aria-labelledby={'loading-modal-title'}
        aria-describedby={'loading-modal-message'}
      >
        <div className={'mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[var(--primary-pale)] text-[var(--primary)] shadow-[0_12px_24px_rgba(20,89,199,0.16)]'}>
          <span className={'h-8 w-8 rounded-full border-[3px] border-[var(--primary)] border-t-transparent animate-spin'} />
        </div>

        <h2 id={'loading-modal-title'} className={'text-xl font-extrabold text-slate-900'}>
          {title}
        </h2>
        <p id={'loading-modal-message'} className={'mt-2 text-sm leading-6 text-[var(--muted)]'}>
          {message}
        </p>

        {hasProgress ? (
          <div className={'mt-5'} aria-label={'Progression du chargement'}>
            <div className={'mb-2 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500'}>
              <span>Progression</span>
              <span>{safeProgress}%</span>
            </div>
            <div className={'h-2 overflow-hidden rounded-full bg-slate-100'}>
              <div className={'h-full rounded-full bg-[var(--primary)] transition-[width] duration-300 ease-out'} style={{ width: `${safeProgress}%` }} />
            </div>
          </div>
        ) : (
          <div className={'mt-5 flex items-center justify-center gap-2'} aria-hidden={'true'}>
            <span className={'h-2.5 w-2.5 rounded-full bg-[var(--primary)] animate-bounce [animation-delay:-0.2s]'} />
            <span className={'h-2.5 w-2.5 rounded-full bg-[var(--primary)] animate-bounce [animation-delay:-0.1s]'} />
            <span className={'h-2.5 w-2.5 rounded-full bg-[var(--primary)] animate-bounce'} />
          </div>
        )}
      </section>
    </div>
  )
}
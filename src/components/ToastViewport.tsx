import { UiIcon, type UiIconName } from './UiIcons'

export type ToastTone = 'success' | 'error' | 'info'

export interface ToastDraft {
  tone: ToastTone
  title: string
  message: string
}

export interface ToastItem extends ToastDraft {
  id: number
}

const TONE_STYLES: Record<ToastTone, {
  icon: UiIconName
  color: string
  bg: string
}> = {
  success: {
    icon: 'check',
    color: '#10b981', // Emerald 500
    bg: '#f0fdf4',   // Emerald 50
  },
  error: {
    icon: 'close',
    color: '#e11d48', // Rose 600
    bg: '#fff1f2',   // Rose 50
  },
  info: {
    icon: 'bell',
    color: '#3b82f6', // Blue 500
    bg: '#eff6ff',   // Blue 50
  },
}

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[]
  onDismiss: (id: number) => void
}) {
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-3 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const s = TONE_STYLES[toast.tone]
        return (
          <article
            key={toast.id}
            role="status"
            className={[
              'pointer-events-auto flex items-start gap-4',
              'w-[380px] bg-white border border-slate-200 rounded-2xl p-4',
              'shadow-[0_20px_40px_-12px_rgba(15,23,42,0.12)]',
              'animate-[toast-in_0.45s_cubic-bezier(0.16,1,0.3,1)]',
              'relative overflow-hidden group'
            ].join(' ')}
          >
            {/* Status accent bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5"
              style={{ background: s.color }}
            />

            {/* Icon wrapper */}
            <div
              className="mt-0.5 flex shrink-0 items-center justify-center w-10 h-10 rounded-xl"
              style={{ backgroundColor: s.bg, color: s.color }}
            >
              <UiIcon name={s.icon} className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-6">
              <h4 className="text-[14.5px] font-bold text-slate-900 leading-tight mb-1">
                {toast.title}
              </h4>
              <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                {toast.message}
              </p>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Fermer la notification"
              className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100"
            >
              <UiIcon name="close" className="w-4 h-4" />
            </button>

            {/* Subtle Progress Bar */}
            <div
              className="absolute bottom-0 left-0 h-0.5"
              style={{
                background: s.color,
                opacity: 0.3,
                width: '100%',
                animation: 'toast-progress 5s linear forwards'
              }}
            />
          </article>
        )
      })}
    </div>
  )
}
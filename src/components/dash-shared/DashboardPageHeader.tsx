import type { ReactNode } from 'react'

interface DashboardPageHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function DashboardPageHeader({ eyebrow, title, subtitle, actions }: DashboardPageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between min-w-0">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#8aad2a]">{eyebrow}</p>
        )}
        <h1 className="mt-0.5 truncate text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-xs text-slate-500 sm:text-sm">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">{actions}</div>}
    </div>
  )
}

export function RefreshButton({ onClick, label = 'Actualiser les données' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-xs transition hover:border-slate-300 hover:text-slate-900"
      title={label}
    >
      <span aria-hidden="true" className="text-sm leading-none">⟳</span>
      <span className="hidden sm:inline">Actualiser</span>
    </button>
  )
}

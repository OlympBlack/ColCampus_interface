import type { ReactNode } from 'react'

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
      {icon && (
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

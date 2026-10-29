import type { ReactNode } from 'react'

export function AuthJourneyShell({
  children,
}: {
  currentStep: 1 | 2 | 3 | 4 | 5
  children: ReactNode
}) {
  return (
    <section className={'section auth-journey relative overflow-hidden'}>
      <div aria-hidden={'true'} className={'pointer-events-none absolute inset-x-10 top-16 h-24 rounded-full bg-green-100/70 blur-3xl'} />
      <div className={'auth-stage relative z-10'}>{children}</div>
    </section>
  )
}
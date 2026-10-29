import { useEffect } from 'react'
import { PageForfaits } from '../components/PageForfaits'
import type { ToastDraft } from '../components/ToastViewport'
import type { AuthSession } from '../types'

interface ForfaitsPageProps {
  session: AuthSession
  onToast: (toast: ToastDraft) => void
}

export function ForfaitsPage({ session, onToast }: ForfaitsPageProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <section className="container py-5">
      <PageForfaits session={session} onToast={onToast} />
    </section>
  )
}

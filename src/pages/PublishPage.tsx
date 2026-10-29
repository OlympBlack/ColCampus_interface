import { useEffect } from 'react'
import { PublishWorkspace } from '../components/PublishWorkspace'
import type { ToastDraft } from '../components/ToastViewport'
import type { AuthSession } from '../types'

interface PublishPageProps {
  session: AuthSession
  onToast: (toast: ToastDraft) => void
  onClose: () => void
}

export function PublishPage({ session, onToast, onClose }: PublishPageProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <section className="container py-5">
      <PublishWorkspace session={session} onToast={onToast} onClose={onClose} />
    </section>
  )
}

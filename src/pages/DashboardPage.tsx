import { DashboardWorkspace } from '../components/Dashboard'
import type { ToastDraft } from '../components/ToastViewport'
import type { AuthSession } from '../types'

interface DashboardPageProps {
  session: AuthSession
  onSessionChange: (session: AuthSession) => void
  onToast: (toast: ToastDraft) => void
  onLogout: () => void
  isLoggingOut: boolean
  onOpenPublish: () => void
}

export function DashboardPage(props: DashboardPageProps) {
  return <DashboardWorkspace {...props} />
}

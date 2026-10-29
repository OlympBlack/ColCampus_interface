import type { AuthSession } from '../types'
import type { ToastDraft } from '../components/ToastViewport'
import { LoginForm } from '../components/LoginForm'

interface LoginPageProps {
  onSuccess: (session: AuthSession) => void
  onToast: (toast: ToastDraft) => void
  onRequireVerification: () => void
}

export function LoginPage(props: LoginPageProps) {
  return <LoginForm {...props} />
}
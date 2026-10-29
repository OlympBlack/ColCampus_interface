import type { ToastDraft } from '../components/ToastViewport'
import { RegisterFlow } from '../components/RegisterFlow'

interface RegisterPageProps {
  onSuccess: (email: string, message: string) => void
  onToast: (toast: ToastDraft) => void
}

export function RegisterPage(props: RegisterPageProps) {
  return <RegisterFlow {...props} />
}
import type { ToastDraft } from '../components/ToastViewport'
import { ProRegisterFlow } from '../components/ProRegister'

interface ProRegisterPageProps {
  onSuccess: (email: string, message: string) => void
  onToast: (toast: ToastDraft) => void
}

export function ProRegisterPage(props: ProRegisterPageProps) {
  return <ProRegisterFlow {...props} />
}
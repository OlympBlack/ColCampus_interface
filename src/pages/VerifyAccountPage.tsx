import type { ToastDraft } from '../components/ToastViewport'
import { OtpVerificationForm } from '../components/OtpVerificationForm'

interface VerifyAccountPageProps {
  onSuccess: () => void
  onToast: (toast: ToastDraft) => void
}

export function VerifyAccountPage(props: VerifyAccountPageProps) {
  return <OtpVerificationForm {...props} />
}
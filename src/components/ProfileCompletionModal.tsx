import type { UserRole } from '../types'
import { getRoleLabel } from '../utils/auth'
import { UiIcon } from './UiIcons'

export function ProfileCompletionModal({
  isOpen,
  role,
  onClose,
  onGoToProfile,
}: {
  isOpen: boolean
  role: UserRole
  onClose: () => void
  onGoToProfile: () => void
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className={'modal-layer'} role={'presentation'}>
      <button type={'button'} className={'modal-backdrop'} aria-label={'Fermer le modal'} onClick={onClose} />
      <section className={'modal-card'} role={'dialog'} aria-modal={'true'} aria-labelledby={'profile-modal-title'}>
        <span className={'modal-card__icon'}><UiIcon name={'check'} /></span>
        <span className={'section__eyebrow'}>Profil a completer</span>
        <h2 id={'profile-modal-title'}>Finalisez votre espace {getRoleLabel(role).toLowerCase()}</h2>
        <p>
          Votre compte est bien actif, mais quelques informations sont encore attendues pour debloquer une experience
          plus complete sur votre dashboard.
        </p>
        <div className={'modal-card__actions'}>
          <button type={'button'} className={'button button--ghost button--fit'} onClick={onClose}>
            Plus tard
          </button>
          <button type={'button'} className={'button button--primary button--fit'} onClick={onGoToProfile}>
            Completer mon profil
          </button>
        </div>
      </section>
    </div>
  )
}

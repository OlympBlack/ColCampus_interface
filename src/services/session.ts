import type { AuthSession } from '../types'

const SESSION_KEY = 'colcampus.session'
const LEGACY_SESSION_KEY = 'coluac.session'
const LAST_ACTIVITY_KEY = 'colcampus.last-activity'
const PENDING_LOGIN_EMAIL_KEY = 'colcampus.pending-login-email'
const PENDING_VERIFICATION_EMAIL_KEY = 'colcampus.pending-verification-email'
const AUTH_NOTICE_KEY = 'colcampus.auth-notice'
const VERIFICATION_NOTICE_KEY = 'colcampus.verification-notice'

export const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes d'inactivité

export function recordUserActivity() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
  } catch {
    // Ignore storage quota or access errors
  }
}

export function getLastActivityTime(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(LAST_ACTIVITY_KEY)
    if (!raw) return null
    const ts = parseInt(raw, 10)
    return isNaN(ts) ? null : ts
  } catch {
    return null
  }
}

export function isSessionExpiredByInactivity(timeoutMs = INACTIVITY_TIMEOUT_MS): boolean {
  const lastActivity = getLastActivityTime()
  if (!lastActivity) {
    // Si la session existe mais aucune activité n'a encore été enregistrée,
    // on initialise l'activité maintenant plutôt que d'expirer immédiatement.
    recordUserActivity()
    return false
  }

  return Date.now() - lastActivity > timeoutMs
}

export function clearUserActivity() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(LAST_ACTIVITY_KEY)
  } catch {
    // Ignore
  }
}

export function getStoredSession() {
  const rawValue = window.localStorage.getItem(SESSION_KEY) ?? window.localStorage.getItem(LEGACY_SESSION_KEY)

  if (!rawValue) {
    return null
  }

  if (isSessionExpiredByInactivity()) {
    clearSession()
    setAuthNotice("Votre session a expiré après 30 minutes d'inactivité. Veuillez vous reconnecter.")
    return null
  }

  try {
    const session = JSON.parse(rawValue) as AuthSession

    return {
      ...session,
      user: {
        ...session.user,
        is_verified: Boolean(session.user?.is_verified),
        profile_completed: Boolean(session.user?.profile_completed),
        statut_verification: session.user?.statut_verification ?? 'non_rempli',
        commentaire_admin: session.user?.commentaire_admin ?? null,
        documents_identite: Array.isArray(session.user?.documents_identite) ? session.user.documents_identite : [],
        profil: session.user?.profil ?? {},
      },
    }
  } catch {
    clearSession()
    return null
  }
}

export function storeSession(session: AuthSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  recordUserActivity()
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY)
  clearUserActivity()
}

export function updateStoredSessionUser(user: AuthSession['user']) {
  const session = getStoredSession()

  if (!session) {
    return null
  }

  const nextSession = { ...session, user }
  storeSession(nextSession)
  return nextSession
}

export function setPendingLoginEmail(email: string) {
  window.sessionStorage.setItem(PENDING_LOGIN_EMAIL_KEY, email)
}

export function setPendingVerificationEmail(email: string) {
  window.sessionStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, email)
}

export function getPendingVerificationEmail() {
  return window.sessionStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY)
}

export function clearPendingVerificationEmail() {
  window.sessionStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY)
}

export function consumePendingLoginEmail() {
  const email = window.sessionStorage.getItem(PENDING_LOGIN_EMAIL_KEY)

  if (email) {
    window.sessionStorage.removeItem(PENDING_LOGIN_EMAIL_KEY)
  }

  return email
}

export function setAuthNotice(message: string) {
  window.sessionStorage.setItem(AUTH_NOTICE_KEY, message)
}

export function setVerificationNotice(message: string) {
  window.sessionStorage.setItem(VERIFICATION_NOTICE_KEY, message)
}

export function consumeAuthNotice() {
  const message = window.sessionStorage.getItem(AUTH_NOTICE_KEY)

  if (message) {
    window.sessionStorage.removeItem(AUTH_NOTICE_KEY)
  }

  return message
}

export function consumeVerificationNotice() {
  const message = window.sessionStorage.getItem(VERIFICATION_NOTICE_KEY)

  if (message) {
    window.sessionStorage.removeItem(VERIFICATION_NOTICE_KEY)
  }

  return message
}

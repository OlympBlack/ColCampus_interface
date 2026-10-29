import type { AuthSession } from '../types'

const SESSION_KEY = 'colcampus.session'
const LEGACY_SESSION_KEY = 'coluac.session'
const PENDING_LOGIN_EMAIL_KEY = 'colcampus.pending-login-email'
const PENDING_VERIFICATION_EMAIL_KEY = 'colcampus.pending-verification-email'
const AUTH_NOTICE_KEY = 'colcampus.auth-notice'
const VERIFICATION_NOTICE_KEY = 'colcampus.verification-notice'

export function getStoredSession() {
  const rawValue = window.localStorage.getItem(SESSION_KEY) ?? window.localStorage.getItem(LEGACY_SESSION_KEY)

  if (!rawValue) {
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
    window.localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function storeSession(session: AuthSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY)
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

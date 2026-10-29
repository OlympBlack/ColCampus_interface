export type CookieConsentChoice = 'accepted' | 'refused'

const COOKIE_CONSENT_KEY = 'colcampus.cookie-consent'

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function getStoredCookieConsent() {
  if (!canUseStorage()) {
    return null
  }

  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_KEY)

    if (value === 'accepted' || value === 'refused') {
      return value as CookieConsentChoice
    }
  } catch {
    return null
  }

  return null
}

export function storeCookieConsent(choice: CookieConsentChoice) {
  if (!canUseStorage()) {
    return
  }

  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, choice)
  } catch {
    // Le consentement reste fonctionnel meme si le stockage local est bloque.
  }
}

import { useEffect, useRef } from 'react'
import type { AuthSession } from '../types'
import {
  INACTIVITY_TIMEOUT_MS,
  isSessionExpiredByInactivity,
  recordUserActivity,
} from '../services/session'

interface UseInactivityTimeoutOptions {
  session: AuthSession | null
  onTimeout: () => void
  timeoutMs?: number
}

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
  'click',
]

/**
 * Déconnecte automatiquement l'utilisateur après 30 minutes d'inactivité.
 * Gère le throttling des événements, la vérification périodique,
 * le retour de veille / changement d'onglet, et la synchronisation multi-onglets.
 */
export function useInactivityTimeout({
  session,
  onTimeout,
  timeoutMs = INACTIVITY_TIMEOUT_MS,
}: UseInactivityTimeoutOptions) {
  const onTimeoutRef = useRef(onTimeout)
  onTimeoutRef.current = onTimeout

  useEffect(() => {
    if (!session) return

    // Marquer l'activité initiale
    recordUserActivity()

    let lastRecordTime = Date.now()

    const handleUserActivity = () => {
      const now = Date.now()
      // Throttle l'écriture dans localStorage à 1 fois toutes les 5 secondes
      if (now - lastRecordTime > 5000) {
        lastRecordTime = now
        recordUserActivity()
      }
    }

    const checkExpiration = () => {
      if (isSessionExpiredByInactivity(timeoutMs)) {
        onTimeoutRef.current()
      }
    }

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        if (isSessionExpiredByInactivity(timeoutMs)) {
          onTimeoutRef.current()
        } else {
          handleUserActivity()
        }
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'colcampus.session' && !e.newValue) {
        // Déconnexion effectuée sur un autre onglet
        onTimeoutRef.current()
      }
    }

    // Attacher les écouteurs d'activité utilisateur
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true })
    })

    window.addEventListener('focus', handleVisibilityOrFocus)
    document.addEventListener('visibilitychange', handleVisibilityOrFocus)
    window.addEventListener('storage', handleStorageChange)

    // Vérification périodique toutes les 15 secondes
    const intervalId = window.setInterval(checkExpiration, 15000)

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleUserActivity)
      })
      window.removeEventListener('focus', handleVisibilityOrFocus)
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus)
      window.removeEventListener('storage', handleStorageChange)
      window.clearInterval(intervalId)
    }
  }, [session, timeoutMs])
}

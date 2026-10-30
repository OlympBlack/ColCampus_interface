/**
 * Utilitaire pour les notifications Web Push / Système du navigateur
 * Affiche des notifications même si l'onglet est en arrière-plan ou minimisé.
 */

export async function requestPushPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    return false
  }

  try {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  } catch {
    return false
  }
}

export interface WebNotificationOptions {
  title: string
  body: string
  icon?: string
  tag?: string
  data?: any
  onClick?: () => void
}

export function showWebPushNotification({
  title,
  body,
  icon = '/assets/images/logo_colcampus_icon.png',
  tag,
  data,
  onClick,
}: WebNotificationOptions): Notification | null {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null
  }

  if (Notification.permission !== 'granted') {
    return null
  }

  // Vibration haptique sur mobile (format: vibre 180ms, pause 80ms, vibre 180ms)
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([180, 80, 180])
    } catch {
      // ignore
    }
  }

  try {
    const notif = new Notification(title, {
      body,
      icon,
      badge: '/assets/images/logo_colcampus_icon.png',
      tag: tag || 'colcampus-message',
      data,
    } as NotificationOptions)

    notif.onclick = () => {
      try {
        window.focus()
      } catch {
        // ignore
      }
      notif.close()
      onClick?.()
    }

    // Auto-fermeture après 8 secondes pour ne pas encombrer l'écran
    setTimeout(() => {
      try {
        notif.close()
      } catch {
        // ignore
      }
    }, 8000)

    return notif
  } catch (err) {
    console.warn('Notification display failed:', err)
    return null
  }
}

/**
 * Utilitaire pour les notifications Web Push / Système du navigateur
 * Compatible Android Chrome (via Service Worker) et Desktop (Notification API).
 */

let swRegistration: ServiceWorkerRegistration | null = null

// Initialisation et enregistrement du Service Worker
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((reg) => {
      swRegistration = reg
    })
    .catch((err) => {
      console.warn('Erreur enregistrement Service Worker:', err)
    })

  // Écoute des messages venant du Service Worker (ex: clic sur notification)
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'COL_CAMPUS_OPEN_CHAT') {
      window.dispatchEvent(new CustomEvent('open-messenger'))
      window.dispatchEvent(
        new CustomEvent('colcampus:open-chat', {
          detail: { conversationId: event.data.conversationId },
        })
      )
    }
  })
}

/**
 * Demande la permission à l'utilisateur pour les notifications.
 * Doit être appelé suite à un clic ou une interaction utilisateur.
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

/**
 * Affiche la notification en haut du téléphone ou sur le bureau.
 */
export async function showWebPushNotification({
  title,
  body,
  icon = '/assets/images/logo_colcampus_icon.png',
  tag,
  data,
  onClick,
}: WebNotificationOptions): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return
  }

  if (Notification.permission !== 'granted') {
    return
  }

  // Vibration haptique sur mobile
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([200, 100, 200])
    } catch {
      // ignore
    }
  }

  const notificationOptions = {
    body,
    icon,
    badge: '/assets/images/logo_colcampus_icon.png',
    tag: tag || 'colcampus-message',
    data: {
      url: window.location.href,
      conversationId: data?.conversationId,
      ...data,
    },
    vibrate: [200, 100, 200],
    renotify: true,
  }

  // 1. Sur Mobile Android Chrome, le Service Worker est INDISPENSABLE
  if ('serviceWorker' in navigator) {
    try {
      const reg = swRegistration || (await navigator.serviceWorker.ready)
      if (reg && reg.showNotification) {
        await reg.showNotification(title, notificationOptions as any)
        return
      }
    } catch (swErr) {
      console.warn('Notification Service Worker warning:', swErr)
    }
  }

  // 2. Fallback pour navigateurs Desktop classiques
  try {
    const notif = new Notification(title, notificationOptions as NotificationOptions)
    notif.onclick = () => {
      try {
        window.focus()
      } catch {}
      notif.close()
      onClick?.()
    }
    setTimeout(() => {
      try {
        notif.close()
      } catch {}
    }, 8000)
  } catch (err) {
    console.warn('Fallback Notification constructor error:', err)
  }
}

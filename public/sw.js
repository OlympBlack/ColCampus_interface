// ColCampus Service Worker : notifications Push système
const DEFAULT_ICON = '/assets/images/logo_colcampus_icon.png'

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  let payload = {}

  try {
    payload = event.data ? event.data.json() : {}
  } catch {
    payload = event.data ? { body: event.data.text() } : {}
  }

  const title = payload.title || 'ColCampus'
  const conversationId = payload.conversationId
  const targetUrl =
    payload.url || (conversationId ? `/#/?conversation=${conversationId}` : '/#/')

  const options = {
    body: payload.body || 'Vous avez un nouveau message sur ColCampus.',
    icon: payload.icon || DEFAULT_ICON,
    badge: DEFAULT_ICON,
    tag: payload.tag || 'colcampus-message',
    data: {
      url: targetUrl,
      conversationId,
      type: payload.type,
    },
    vibrate: [300, 150, 300, 150, 350],
    renotify: true,
    silent: false,
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const targetUrl = event.notification.data?.url || '/#/'
  const convId = event.notification.data?.conversationId

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const sameOriginClients = clientList.filter((client) =>
        client.url.startsWith(self.location.origin)
      )

      for (const client of sameOriginClients) {
        if ('focus' in client) {
          if (convId) {
            client.postMessage({ type: 'COL_CAMPUS_OPEN_CHAT', conversationId: convId })
          }
          return client.focus()
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl)
      }
    })
  )
})

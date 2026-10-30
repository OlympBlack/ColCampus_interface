import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { API_BASE_URL } from '../services/api'

;(window as any).Pusher = Pusher as any

export const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY || 'no-key',
    wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
    wsPort: import.meta.env.VITE_REVERB_PORT || 80,
    wssPort: import.meta.env.VITE_REVERB_PORT || 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
    authorizer: (channel: any) => {
        return {
            authorize: (socketId: string, callback: Function) => {
                const sessionStore = localStorage.getItem('colcampus.session') ?? localStorage.getItem('coluac.session')
                let token = null
                try {
                    if (sessionStore) {
                        token = JSON.parse(sessionStore).token
                    }
                } catch (e) {
                    console.error('Failed to parse session for Echo auth', e)
                }

        // Target the broadcasting/auth endpoint within the API group
        const authUrl = `${API_BASE_URL}/broadcasting/auth`;

        fetch(authUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          body: JSON.stringify({
            socket_id: socketId,
            channel_name: channel.name,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            callback(false, data)
          })
          .catch((error) => {
            console.error('Echo auth error:', error)
            callback(true, error)
          })
            },
        }
    },
})

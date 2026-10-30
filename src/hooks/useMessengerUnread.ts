import { useState, useEffect, useCallback, useRef } from 'react'
import { echo } from '../lib/echo'
import { fetchDashboard } from '../services/api'
import type { AuthSession, ConversationMessage } from '../types'
import { playMagicChime } from '../utils/audioChime'
import { showWebPushNotification } from '../utils/webPush'

export function useMessengerUnread(session: AuthSession | null) {
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const unreadConvIdsRef = useRef<Set<number>>(new Set())
  const lastKnownMessageIdByConvRef = useRef<Map<number, number>>(new Map())
  const initialScanDoneRef = useRef(false)

  const sessionToken = session?.token
  const userId = session?.user?.id

  // Déclenchement de la notification push pour un nouveau message
  const notifyIncomingMessage = useCallback(
    (conv: any, message: ConversationMessage) => {
      // Ignorer ses propres messages
      if (!message || message.user_id === userId) return

      // 1. Jouer le carillon magique "cloohummmm"
      playMagicChime()

      // 2. Déclencher la notification Push en haut de l'écran Android
      const partner =
        conv.sender_id === userId ? conv.receiver : conv.sender
      const partnerName =
        partner?.prenoms || partner?.name || 'Nouveau message'
      const isAudio =
        message.type === 'audio' || Boolean(message.media_url)
      const preview = isAudio
        ? '🎤 Nouveau message vocal'
        : message.content || 'Vous a envoyé un message'

      showWebPushNotification({
        title: `${partnerName} sur ColCampus`,
        body: preview,
        icon: partner?.photo_profil || '/assets/images/logo_colcampus_icon.png',
        tag: conv.id ? `colcampus-conv-${conv.id}` : 'colcampus-chat',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('open-messenger'))
          window.dispatchEvent(
            new CustomEvent('colcampus:open-chat', {
              detail: { conversationId: conv.id },
            })
          )
        },
      })
    },
    [userId]
  )

  const refreshUnreadCount = useCallback(async () => {
    if (!sessionToken) {
      unreadConvIdsRef.current.clear()
      lastKnownMessageIdByConvRef.current.clear()
      initialScanDoneRef.current = false
      setUnreadCount(0)
      return
    }

    try {
      const res = await fetchDashboard(sessionToken)
      const conversations = res.data?.mes_conversations

      if (Array.isArray(conversations)) {
        // 1. Calcul du compteur de conversations non lues
        const unreadConvs = conversations.filter(
          (d) => (d.conversation.unread_count ?? 0) > 0
        )
        const newSet = new Set<number>(unreadConvs.map((d) => d.conversation.id))
        unreadConvIdsRef.current = newSet
        setUnreadCount(newSet.size)

        // 2. Détection en temps réel des NOUVEAUX messages réels
        conversations.forEach((d) => {
          const conv = d.conversation
          const lastMsg = d.last_message as ConversationMessage | null

          if (!conv || !lastMsg || !lastMsg.id) return

          const prevLastId = lastKnownMessageIdByConvRef.current.get(conv.id)

          // Si le scan initial est déjà passé et qu'un nouveau message arrive
          if (initialScanDoneRef.current) {
            if (prevLastId === undefined || lastMsg.id > prevLastId) {
              lastKnownMessageIdByConvRef.current.set(conv.id, lastMsg.id)
              notifyIncomingMessage(conv, lastMsg)
            }
          } else {
            // Premier scan : on mémorise simplement l'ID actuel pour ne pas notifier les anciens messages
            lastKnownMessageIdByConvRef.current.set(conv.id, lastMsg.id)
          }
        })

        initialScanDoneRef.current = true
      } else if (typeof res.data?.unread_messages_count === 'number') {
        setUnreadCount(res.data.unread_messages_count)
      } else {
        setUnreadCount(0)
      }
    } catch {
      // silent fallback
    }
  }, [sessionToken, notifyIncomingMessage])

  // Initial fetch on session change
  useEffect(() => {
    if (sessionToken) {
      void refreshUnreadCount()
    } else {
      unreadConvIdsRef.current.clear()
      lastKnownMessageIdByConvRef.current.clear()
      initialScanDoneRef.current = false
      setUnreadCount(0)
    }
  }, [sessionToken, refreshUnreadCount])

  // Polling temps réel (toutes les 4 secondes) + écoute WebSocket Reverb si disponible
  useEffect(() => {
    if (!userId || !sessionToken) return

    // 1. Polling périodique toutes les 4s pour garantir la réception instantanée
    // même lorsque le serveur fonctionne en broadcast log
    const pollInterval = setInterval(() => {
      void refreshUnreadCount()
    }, 4000)

    // 2. Détection immédiate lors du réveil du téléphone ou retour sur l'onglet
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void refreshUnreadCount()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 3. Écoute Echo WebSocket au cas où Reverb est actif
    const channel = echo.private(`users.${userId}`)

    const handleMessageSent = (data?: {
      conversation?: any
      message?: ConversationMessage
    }) => {
      if (data?.conversation && data?.message) {
        lastKnownMessageIdByConvRef.current.set(
          data.conversation.id,
          data.message.id
        )
        notifyIncomingMessage(data.conversation, data.message)
      }
      void refreshUnreadCount()
    }

    const handleMessagesRead = () => {
      void refreshUnreadCount()
    }

    channel.listen('.MessageSent', handleMessageSent)
    channel.listen('MessageSent', handleMessageSent)
    channel.listen('.MessagesRead', handleMessagesRead)
    channel.listen('MessagesRead', handleMessagesRead)

    return () => {
      clearInterval(pollInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      channel.stopListening('.MessageSent')
      channel.stopListening('MessageSent')
      channel.stopListening('.MessagesRead')
      channel.stopListening('MessagesRead')
    }
  }, [userId, sessionToken, refreshUnreadCount, notifyIncomingMessage])

  const decrementUnreadCount = useCallback((convId?: number) => {
    if (convId && unreadConvIdsRef.current.has(convId)) {
      unreadConvIdsRef.current.delete(convId)
      setUnreadCount(unreadConvIdsRef.current.size)
    } else {
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }, [])

  return {
    unreadCount,
    setUnreadCount,
    decrement: decrementUnreadCount,
    refresh: refreshUnreadCount,
  }
}

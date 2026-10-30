import { useState, useEffect, useCallback, useRef } from 'react'
import { echo } from '../lib/echo'
import { fetchDashboard } from '../services/api'
import type { AuthSession, ConversationMessage } from '../types'
import { playMagicChime } from '../utils/audioChime'
import { showWebPushNotification } from '../utils/webPush'

export function useMessengerUnread(session: AuthSession | null) {
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const unreadConvIdsRef = useRef<Set<number>>(new Set())
  const sessionToken = session?.token
  const userId = session?.user?.id

  const refreshUnreadCount = useCallback(async () => {
    if (!sessionToken) {
      unreadConvIdsRef.current.clear()
      setUnreadCount(0)
      return
    }
    try {
      const res = await fetchDashboard(sessionToken)
      if (Array.isArray(res.data?.mes_conversations)) {
        const unreadConvs = res.data.mes_conversations.filter(
          (d) => (d.conversation.unread_count ?? 0) > 0
        )
        const newSet = new Set<number>(unreadConvs.map((d) => d.conversation.id))
        unreadConvIdsRef.current = newSet
        setUnreadCount(newSet.size)
      } else if (typeof res.data?.unread_messages_count === 'number') {
        setUnreadCount(res.data.unread_messages_count)
      } else {
        setUnreadCount(0)
      }
    } catch {
      // silent fallback
    }
  }, [sessionToken])

  // Initial fetch on session change
  useEffect(() => {
    if (sessionToken) {
      void refreshUnreadCount()
    } else {
      unreadConvIdsRef.current.clear()
      setUnreadCount(0)
    }
  }, [sessionToken, refreshUnreadCount])

  // Real-time listener for incoming messages and updates
  useEffect(() => {
    if (!userId || !sessionToken) return

    const channel = echo.private(`users.${userId}`)

    const handleMessageSent = (data?: { conversation?: any; message?: ConversationMessage }) => {
      // If message is from another user, increment distinct conversations
      if (!data?.message || data.message.user_id !== userId) {
        const convId = data?.conversation?.id
        if (convId) {
          if (!unreadConvIdsRef.current.has(convId)) {
            unreadConvIdsRef.current.add(convId)
            setUnreadCount(unreadConvIdsRef.current.size)
          }
        }

        // Jouer le son magique "cloohummmm"
        playMagicChime()

        // Déclencher la notification Push système du navigateur
        const partner = data?.conversation?.sender_id === userId ? data?.conversation?.receiver : data?.conversation?.sender
        const partnerName = partner?.prenoms || partner?.name || 'Nouveau message'
        const isAudio = data?.message?.type === 'audio' || Boolean(data?.message?.media_url)
        const preview = isAudio ? '🎤 Nouveau message vocal' : (data?.message?.content || 'Vous a envoyé un message')

        showWebPushNotification({
          title: `${partnerName} sur ColCampus`,
          body: preview,
          icon: partner?.photo_profil || '/assets/images/logo_colcampus_icon.png',
          tag: convId ? `colcampus-conv-${convId}` : 'colcampus-chat',
          onClick: () => {
            window.dispatchEvent(new CustomEvent('open-messenger'))
            window.dispatchEvent(new CustomEvent('colcampus:open-chat', { detail: { conversationId: convId } }))
          },
        })
      }
      void refreshUnreadCount()
    }

    const handleMessagesRead = () => {
      void refreshUnreadCount()
    }

    const handleNotification = (notif: any) => {
      if (
        notif?.type === 'annonce_message' ||
        notif?.data?.type === 'annonce_message' ||
        notif?.meta?.conversation_id ||
        notif?.data?.meta?.conversation_id
      ) {
        const convId = notif?.meta?.conversation_id ?? notif?.data?.meta?.conversation_id
        if (convId) {
          const numId = Number(convId)
          if (!unreadConvIdsRef.current.has(numId)) {
            unreadConvIdsRef.current.add(numId)
            setUnreadCount(unreadConvIdsRef.current.size)
          }
        }
        void refreshUnreadCount()
      }
    }

    channel.listen('.MessageSent', handleMessageSent)
    channel.listen('MessageSent', handleMessageSent)
    channel.listen('.MessagesRead', handleMessagesRead)
    channel.listen('MessagesRead', handleMessagesRead)
    channel.notification(handleNotification)

    // Periodic heartbeat sync every 20 seconds
    const interval = setInterval(() => {
      void refreshUnreadCount()
    }, 20000)

    return () => {
      channel.stopListening('.MessageSent')
      channel.stopListening('MessageSent')
      channel.stopListening('.MessagesRead')
      channel.stopListening('MessagesRead')
      clearInterval(interval)
    }
  }, [userId, sessionToken, refreshUnreadCount])

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

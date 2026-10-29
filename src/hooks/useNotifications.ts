import { useState, useEffect, useCallback } from 'react'
import { echo } from '../lib/echo'
import { fetchNotifications, markNotificationAsRead } from '../services/api'
import type { AuthSession, NotificationCenterData } from '../types'

export function useNotifications(session: AuthSession | null) {
    const [data, setData] = useState<NotificationCenterData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const sessionToken = session?.token
    const userId = session?.user?.id

    const loadNotifications = useCallback(async (silent = false) => {
        if (!sessionToken) {
            setData(null)
            setLoading(false)
            return
        }
        if (!silent) setLoading(true)
        try {
            const res = await fetchNotifications(sessionToken)
            setData(res.data)
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Impossible de charger les notifications.')
        } finally {
            if (!silent) setLoading(false)
        }
    }, [sessionToken])

    useEffect(() => {
        if (sessionToken) {
            loadNotifications()
        } else {
            setData(null)
            setLoading(false)
        }
    }, [sessionToken, loadNotifications])

    useEffect(() => {
        if (!userId || !sessionToken) return

        // Laravel broadcasts notifications to private channel: users.{id}
        const channel = echo.private(`users.${userId}`)

        channel.notification((notification: any) => {
            console.log('Real-time notification received:', notification)
            loadNotifications(true)
        })

        return () => {
            channel.stopListening('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated')
        }
    }, [userId, sessionToken, loadNotifications])

    const markAsRead = async (notificationId: string) => {
        if (!sessionToken) return
        try {
            await markNotificationAsRead(sessionToken, notificationId)
            // Update local state
            setData(prev => {
                if (!prev) return prev
                const target = prev.notifications.find(n => n.id === notificationId)
                if (!target || target.read_at) return prev

                return {
                    ...prev,
                    unread_count: Math.max(0, prev.unread_count - 1),
                    unread: prev.unread.filter(n => n.id !== notificationId),
                    notifications: prev.notifications.map(n => n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n)
                }
            })
        } catch (err) {
            console.error('Failed to mark notification as read:', err)
        }
    }

    return {
        data,
        loading,
        error,
        refresh: loadNotifications,
        markAsRead
    }
}

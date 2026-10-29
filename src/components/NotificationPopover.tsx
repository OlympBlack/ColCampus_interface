import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { AppNotification, AuthSession, NotificationCenterData } from '../types'
import { UiIcon, type UiIconName } from './UiIcons'

export interface NotificationPopoverProps {
  session: AuthSession
  isOpen: boolean
  onClose: () => void
  data: NotificationCenterData | null
  loading: boolean
  markAsRead: (id: string) => Promise<void>
  refresh: () => void
}

export function NotificationPopover({
  isOpen,
  onClose,
  data,
  loading,
  markAsRead,
  refresh,
}: NotificationPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-popover-trigger]')) {
        return
      }
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const notifications = data?.notifications ?? []

  const content = (
    <>
      <style>{`
        .colcampus-notif {
          position: fixed;
          z-index: 100005;
          background: #fff;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: 'Poppins', 'DM Sans', 'Inter', sans-serif;
          padding-top: env(safe-area-inset-top, 0px);
        }
        @media (min-width: 768px) {
          .colcampus-notif {
            top: calc(var(--header-bottom, 80px) + 10px);
            right: 20px;
            width: 400px;
            max-width: calc(100vw - 32px);
            height: calc(100vh - var(--header-bottom, 80px) - 24px);
            max-height: 620px;
            border-radius: 18px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(15, 23, 42, 0.05);
          }
        }
        @media (max-width: 767px) {
          .colcampus-notif {
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100dvh;
            max-height: 100dvh;
            border-radius: 0;
            border: none;
            box-shadow: none;
          }
        }
        .fb-header { display: flex; align-items: center; justify-content: space-between; padding: 16px; background: #fff; border-bottom: 1px solid #f1f5f9; }
        .fb-title-wrap { display: flex; align-items: center; gap: 12px; }
        .fb-title { font-size: 22px; font-weight: 800; margin: 0; color: #0f172a; letter-spacing: -0.02em; font-family: 'Poppins', sans-serif; }
        .fb-header-actions { display: flex; gap: 12px; }
        .fb-circle-btn { width: 36px; height: 36px; border-radius: 50%; background: #f1f5f9; border: none; display: flex; align-items: center; justify-content: center; color: #0f172a; cursor: pointer; }
        .fb-notif-group-title { font-size: 16px; font-weight: 800; color: #0f172a; padding: 8px 16px; margin: 0; }
        .fb-notif-item { display: flex; align-items: center; gap: 12px; padding: 8px 16px; cursor: pointer; border: none; width: 100%; text-align: left; transition: background 0.2s; position: relative; }
        .fb-notif-item.unread { background: #f7fbe9; }
        .fb-notif-item.read { background: transparent; }
        .fb-notif-item:hover { background: #f9fafb; }
        .fb-notif-item.unread:hover { background: #eef6d4; }
        .fb-avatar-wrap { position: relative; flex-shrink: 0; }
        .fb-avatar { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 1px solid #f1f5f9; }
        .fb-avatar-fallback { width: 56px; height: 56px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 22px; }
        .fb-sub-badge { position: absolute; bottom: -2px; right: -2px; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; border: 2px solid #fff; }
        .fb-content { flex: 1; min-width: 0; }
        .fb-notif-text { font-size: 14px; color: #0f172a; line-height: 1.35; margin-bottom: 4px; }
        .fb-notif-time { font-size: 12px; color: #6f8d21; font-weight: 700; }
        .fb-notif-time.read-time { color: #64748b; font-weight: 500; }
        .fb-unread-dot { width: 10px; height: 10px; border-radius: 50%; background: #a4c639; flex-shrink: 0; margin-left: 8px; }
        .fb-more-btn { background: transparent; border: none; color: #64748b; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; margin-left: 4px; }
        .fb-more-btn:hover { background: #f1f5f9; }
      `}</style>
      <div ref={popoverRef} className="colcampus-notif shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="fb-header">
          <div className="fb-title-wrap">
            <button
              type="button"
              onClick={onClose}
              className="fb-circle-btn d-md-none"
              style={{ width: 34, height: 34, marginRight: 2 }}
              title="Fermer"
              aria-label="Fermer les notifications"
            >
              <UiIcon name="arrow-left" />
            </button>
            <h3 className="fb-title">Notifications</h3>
          </div>
          <div className="fb-header-actions">
            <button className="fb-circle-btn" onClick={() => refresh()} disabled={loading} title="Actualiser" aria-label="Actualiser">
              <UiIcon name="refresh" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="fb-circle-btn"
              title="Fermer"
              aria-label="Fermer les notifications"
            >
              <UiIcon name="close" />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', paddingBottom: 20 }}>
          {loading && notifications.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Chargement...</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Aucune notification pour le moment</div>
          ) : (
            <>
              <h4 className="fb-notif-group-title">Nouveau</h4>
              {notifications.map(n => {
                const isUnread = !Boolean(n.read_at)
                return (
                  <button
                    key={n.id}
                    className={`fb-notif-item ${isUnread ? 'unread' : 'read'}`}
                    onClick={() => {
                      if (isUnread) void markAsRead(n.id)
                      if (n.action_url) {
                        if (n.action_url.startsWith('#')) window.location.hash = n.action_url
                        else window.location.href = n.action_url
                      }
                      onClose()
                    }}
                  >
                    <NotificationAvatar notification={n} />
                    <div className="fb-content">
                      <div className="fb-notif-text" style={{ fontWeight: isUnread ? 600 : 400 }}>
                        <strong style={{ fontWeight: 800 }}>{n.title}</strong>{' '}
                        {n.body}
                      </div>
                      <div className={`fb-notif-time ${!isUnread ? 'read-time' : ''}`}>{formatRelativeTime(n.created_at)}</div>
                    </div>
                    {isUnread && <div className="fb-unread-dot" />}
                    <div
                      className="fb-more-btn"
                      onClick={e => {
                        e.stopPropagation()
                        if (isUnread) void markAsRead(n.id)
                      }}
                    >
                      <UiIcon name="dots-vertical" />
                    </div>
                  </button>
                )
              })}
            </>
          )}
        </div>
      </div>
    </>
  )

  return createPortal(content, document.body)
}

function NotificationAvatar({ notification }: { notification: AppNotification }) {
  const photo = notification.meta.sender?.photo_profil
  const type = notification.type

  if (photo) {
    return (
      <div className="fb-avatar-wrap">
        <img src={photo} className="fb-avatar" alt="" />
        <div className="fb-sub-badge" style={{ backgroundColor: getTypeColor(type), fontSize: '12px' }}>
          <span style={{ width: '1em', height: '1em', display: 'flex' }}>
            <UiIcon name={getTypeIcon(type)} />
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="fb-avatar-wrap">
      <div className="fb-avatar-fallback" style={{ backgroundColor: getTypeColor(type) + '20', color: getTypeColor(type) }}>
        <UiIcon name={getTypeIcon(type)} />
      </div>
    </div>
  )
}

function getTypeIcon(type: string): UiIconName {
  switch (type) {
    case 'annonce_message':
      return 'message'
    case 'kyc_reviewed':
      return 'shield'
    default:
      return 'bell'
  }
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'annonce_message':
      return '#a4c639'
    case 'kyc_reviewed':
      return '#22c55e'
    default:
      return '#64748b'
  }
}

function formatRelativeTime(dateStr: string | null) {
  if (!dateStr) return 'Instantané'
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diff < 60) return `Il y a ${diff}s`
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)}m`
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`
  return date.toLocaleDateString()
}

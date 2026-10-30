import type { ReactNode } from 'react'

export type UiIconName =
  | 'home'
  | 'grid'
  | 'user'
  | 'all'
  | 'bed'
  | 'users'
  | 'search-user'
  | 'menu'
  | 'close'
  | 'dashboard'
  | 'briefcase'
  | 'store'
  | 'document'
  | 'shield'
  | 'bell'
  | 'map-pin'
  | 'search'
  | 'minus'
  | 'plus'
  | 'logout'
  | 'chevron-down'
  | 'check'
  | 'message'
  | 'phone'
  | 'dots-vertical'
  | 'send'
  | 'message-circle'
  | 'check-double'
  | 'lock'
  | 'shield-check'
  | 'eye'
  | 'eye-off'
  | 'edit'
  | 'trash'
  | 'image'
  | 'messages'
  | 'refresh'
  | 'external-link'
  | 'heart'
  | 'x'
  | 'chevron-right'
  | 'alert'
  | 'arrow-left'
  | 'star'
  | 'flag'
  | 'shield-alert'
  | 'settings'
  | 'upload'
  | 'mic'
  | 'play'
  | 'pause'
  | 'stop'

function IconFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox={'0 0 24 24'} aria-hidden={'true'} className={`ui-icon ${className || ''}`} fill={'none'} stroke={'currentColor'} strokeWidth={'1.9'} strokeLinecap={'round'} strokeLinejoin={'round'}>
      {children}
    </svg>
  )
}

export function UiIcon({ name, className }: { name: UiIconName; className?: string }) {
  if (name === 'all') {
    return <IconFrame className={className}><path d={'M6 7h12'} /><path d={'M4 12h16'} /><path d={'M6 17h12'} /></IconFrame>
  }

  if (name === 'home') {
    return <IconFrame className={className}><path d={'M3 10.5 12 3l9 7.5'} /><path d={'M5.5 9.5V20h13V9.5'} /><path d={'M9.5 20v-5h5v5'} /></IconFrame>
  }

  if (name === 'grid') {
    return <IconFrame className={className}><rect x={'4'} y={'4'} width={'6'} height={'6'} rx={'1.2'} /><rect x={'14'} y={'4'} width={'6'} height={'6'} rx={'1.2'} /><rect x={'4'} y={'14'} width={'6'} height={'6'} rx={'1.2'} /><rect x={'14'} y={'14'} width={'6'} height={'6'} rx={'1.2'} /></IconFrame>
  }

  if (name === 'user') {
    return <IconFrame className={className}><circle cx={'12'} cy={'8'} r={'3.2'} /><path d={'M5 19c1.7-3 4.1-4.5 7-4.5S17.3 16 19 19'} /></IconFrame>
  }

  if (name === 'bed') {
    return <IconFrame className={className}><path d={'M4 18v-7'} /><path d={'M20 18v-4.5H4V18'} /><path d={'M7 13.5V9.2h4.4a2.1 2.1 0 0 1 2.1 2.1v2.2'} /><path d={'M13.5 13.5V11h2.8A2.7 2.7 0 0 1 19 13.7v-.2'} /></IconFrame>
  }

  if (name === 'users') {
    return <IconFrame className={className}><circle cx={'9'} cy={'9'} r={'2.7'} /><circle cx={'16.5'} cy={'10'} r={'2.2'} /><path d={'M4.8 18c1.2-2.5 3.1-3.8 5.8-3.8 2.6 0 4.7 1.3 6 3.8'} /><path d={'M15 14.7c1.7.3 3 1.2 4.2 3'} /></IconFrame>
  }

  if (name === 'search-user') {
    return <IconFrame className={className}><circle cx={'10'} cy={'9'} r={'3'} /><path d={'M4.8 18c1.2-2.4 3-3.6 5.2-3.6'} /><circle cx={'17'} cy={'17'} r={'3'} /><path d={'m19.2 19.2 2 2'} /></IconFrame>
  }

  if (name === 'menu') {
    return <IconFrame className={className}><path d={'M4 7h16'} /><path d={'M4 12h16'} /><path d={'M4 17h16'} /></IconFrame>
  }

  if (name === 'close') {
    return <IconFrame className={className}><path d={'M6 6l12 12'} /><path d={'M18 6 6 18'} /></IconFrame>
  }

  if (name === 'dashboard') {
    return <IconFrame className={className}><path d={'M4 12h7V4H4z'} /><path d={'M13 20h7v-8h-7z'} /><path d={'M13 10h7V4h-7z'} /><path d={'M4 20h7v-6H4z'} /></IconFrame>
  }

  if (name === 'briefcase') {
    return <IconFrame className={className}><path d={'M4 9.5h16V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z'} /><path d={'M9 9.5V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2.5'} /><path d={'M4 12.5h16'} /></IconFrame>
  }

  if (name === 'store') {
    return <IconFrame className={className}><path d={'M4 10h16'} /><path d={'M6 10V7h12v3'} /><path d={'M5 10l1 10h12l1-10'} /><path d={'M9 14h6'} /></IconFrame>
  }

  if (name === 'document') {
    return <IconFrame className={className}><path d={'M8 3.5h6l4 4V20H8a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z'} /><path d={'M14 3.5V8h4'} /><path d={'M9 12h6'} /><path d={'M9 16h6'} /></IconFrame>
  }

  if (name === 'shield') {
    return <IconFrame className={className}><path d={'M12 3l7 3v5c0 4.5-2.7 7.8-7 10-4.3-2.2-7-5.5-7-10V6l7-3Z'} /><path d={'m9.5 12 1.8 1.8L15 10'} /></IconFrame>
  }

  if (name === 'bell') {
    return <IconFrame className={className}><path d={'M15 17H9'} /><path d={'M18 17H6l1.4-1.6V10a4.6 4.6 0 1 1 9.2 0v5.4Z'} /><path d={'M10.8 20a1.7 1.7 0 0 0 2.4 0'} /></IconFrame>
  }

  if (name === 'map-pin') {
    return <IconFrame className={className}><path d={'M12 21s6-5.1 6-10a6 6 0 1 0-12 0c0 4.9 6 10 6 10Z'} /><circle cx={'12'} cy={'11'} r={'2.2'} /></IconFrame>
  }

  if (name === 'search') {
    return <IconFrame className={className}><circle cx={'11'} cy={'11'} r={'6.2'} /><path d={'m16 16 4 4'} /></IconFrame>
  }

  if (name === 'minus') {
    return <IconFrame className={className}><path d={'M6 12h12'} /></IconFrame>
  }

  if (name === 'plus') {
    return <IconFrame className={className}><path d={'M12 6v12'} /><path d={'M6 12h12'} /></IconFrame>
  }

  if (name === 'logout') {
    return <IconFrame className={className}><path d={'M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4'} /><path d={'M14 8l4 4-4 4'} /><path d={'M9 12h9'} /></IconFrame>
  }

  if (name === 'chevron-down') {
    return <IconFrame className={className}><path d={'m6 9 6 6 6-6'} /></IconFrame>
  }

  if (name === 'check') {
    return <IconFrame className={className}><path d={'m5 12 4 4L19 6'} /></IconFrame>
  }

  if (name === 'message') {
    return <IconFrame className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></IconFrame>
  }

  if (name === 'phone') {
    return <IconFrame className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.88 12.88 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></IconFrame>
  }

  if (name === 'dots-vertical') {
    return <IconFrame className={className}><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></IconFrame>
  }

  if (name === 'send') {
    return <IconFrame className={className}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></IconFrame>
  }

  if (name === 'message-circle') {
    return <IconFrame className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></IconFrame>
  }

  if (name === 'check-double') {
    return <IconFrame className={className}><path d="M2 12l5 5L20 4" /><path d="M7 12l5 5L23 4" /></IconFrame>
  }

  if (name === 'lock') {
    return <IconFrame className={className}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></IconFrame>
  }

  if (name === 'shield-check') {
    return <IconFrame className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></IconFrame>
  }

  if (name === 'eye') {
    return <IconFrame className={className}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></IconFrame>
  }

  if (name === 'eye-off') {
    return <IconFrame className={className}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></IconFrame>
  }

  if (name === 'edit') {
    return <IconFrame className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></IconFrame>
  }

  if (name === 'trash') {
    return <IconFrame className={className}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></IconFrame>
  }

  if (name === 'image') {
    return <IconFrame className={className}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></IconFrame>
  }

  if (name === 'messages') {
    return <IconFrame className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></IconFrame>
  }

  if (name === 'refresh') {
    return <IconFrame className={className}><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></IconFrame>
  }

  if (name === 'external-link') {
    return <IconFrame className={className}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" /></IconFrame>
  }

  if (name === 'heart') {
    return <IconFrame className={className}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></IconFrame>
  }

  if (name === 'x') {
    return <IconFrame className={className}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></IconFrame>
  }

  if (name === 'chevron-right') {
    return <IconFrame className={className}><polyline points="9 18 15 12 9 6" /></IconFrame>
  }

  if (name === 'alert') {
    return <IconFrame className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></IconFrame>
  }

  if (name === 'arrow-left') {
    return <IconFrame className={className}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></IconFrame>
  }

  if (name === 'star') {
    return <IconFrame className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></IconFrame>
  }

  if (name === 'flag') {
    return <IconFrame className={className}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></IconFrame>
  }

  if (name === 'shield-alert') {
    return <IconFrame className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></IconFrame>
  }

  if (name === 'settings') {
    return (
      <IconFrame className={className}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </IconFrame>
    )
  }

  if (name === 'upload') {
    return (
      <IconFrame className={className}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </IconFrame>
    )
  }

  if (name === 'mic') {
    return (
      <IconFrame className={className}>
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </IconFrame>
    )
  }

  if (name === 'play') {
    return (
      <IconFrame className={className}>
        <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
      </IconFrame>
    )
  }

  if (name === 'pause') {
    return (
      <IconFrame className={className}>
        <rect x="6" y="4" width="4" height="16" fill="currentColor" />
        <rect x="14" y="4" width="4" height="16" fill="currentColor" />
      </IconFrame>
    )
  }

  if (name === 'stop') {
    return (
      <IconFrame className={className}>
        <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" />
      </IconFrame>
    )
  }

  return <IconFrame className={className}><circle cx={'12'} cy={'12'} r={'7'} /></IconFrame>
}
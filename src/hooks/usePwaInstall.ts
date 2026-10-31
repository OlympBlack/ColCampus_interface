import { useEffect, useState, useCallback } from 'react'

const DISMISS_STORAGE_KEY = 'colcampus_pwa_dismissed_until'
const DISMISS_DURATION_DAYS = 5

export interface PwaInstallState {
  isInstallable: boolean
  isInstalled: boolean
  isIos: boolean
  canPromptNative: boolean
  promptInstall: () => Promise<boolean>
  dismissPrompt: () => void
  showIosGuide: boolean
  setShowIosGuide: (show: boolean) => void
}

export function usePwaInstall(): PwaInstallState {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState<boolean>(false)
  const [isDismissed, setIsDismissed] = useState<boolean>(false)
  const [showIosGuide, setShowIosGuide] = useState<boolean>(false)

  // Détection iOS
  const isIos =
    typeof window !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as any).MSStream

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Vérifier si déjà en mode standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')

    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    // Vérifier si l'utilisateur a fermé la bannière récemment
    const dismissedUntil = localStorage.getItem(DISMISS_STORAGE_KEY)
    if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
      setIsDismissed(true)
    }

    // Écoute de l'événement PWA standard
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      localStorage.removeItem(DISMISS_STORAGE_KEY)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt()
        const choice = await deferredPrompt.userChoice
        if (choice.outcome === 'accepted') {
          setIsInstalled(true)
          setDeferredPrompt(null)
          return true
        } else {
          // L'utilisateur a refusé dans la boîte native
          dismissPrompt()
          return false
        }
      } catch (err) {
        console.warn('Erreur prompt PWA:', err)
        return false
      }
    } else if (isIos) {
      setShowIosGuide(true)
      return true
    }
    return false
  }, [deferredPrompt, isIos])

  const dismissPrompt = useCallback(() => {
    const expireTime = Date.now() + DISMISS_DURATION_DAYS * 24 * 60 * 60 * 1000
    localStorage.setItem(DISMISS_STORAGE_KEY, String(expireTime))
    setIsDismissed(true)
    setShowIosGuide(false)
  }, [])

  // Est installable si pas encore installé et (prompt natif disponible OU iOS Safari)
  const isInstallable = !isInstalled && !isDismissed && (Boolean(deferredPrompt) || isIos)
  const canPromptNative = Boolean(deferredPrompt)

  return {
    isInstallable,
    isInstalled,
    isIos,
    canPromptNative,
    promptInstall,
    dismissPrompt,
    showIosGuide,
    setShowIosGuide,
  }
}

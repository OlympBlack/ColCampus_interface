import { useEffect, useState, useCallback } from 'react'
import { fetchPlatformSettings, type PlatformSettings } from '../services/api'

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  id: 1,
  nom_plateforme: 'ColCampus',
  slogan: 'La plateforme de logement et de colocation étudiante autour des campus du Bénin',
  description: 'ColCampus met en relation étudiants, bailleurs et démarcheurs autour des quatre grandes universités publiques du Bénin : UAC, UNA, UNSTIM et UP. Trouvez ou proposez facilement une chambre ou une colocation près de votre campus.',
  logo_url: '/logo-colcampus.png',
  campus_localisation: 'Campus UAC, UNA, UNSTIM & UP • Bénin',
  telephone: '+229 01 54 47 00 02',
  whatsapp: '+229 01 54 47 00 02',
  email_contact: 'contact@colcampus.com',
  email_support: 'support@colcampus.com',
  signature_auteur: 'GBASSI Jules-christ',
  signature_url: 'https://juleschrist-portfolio.vercel.app/',
  signature_texte: 'Conçu & développé par',
  copyright_texte: 'ColCampus. Tous droits réservés.',
}

let cachedSettings: PlatformSettings | null = null

export function broadcastSettingsUpdate(newSettings: PlatformSettings) {
  cachedSettings = newSettings
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('colcampus:settings-updated', { detail: newSettings }))
  }
}

export function usePlatformSettings() {
  const [settings, setSettings] = useState<PlatformSettings>(() => cachedSettings || DEFAULT_PLATFORM_SETTINGS)
  const [loading, setLoading] = useState<boolean>(!cachedSettings)
  const [error, setError] = useState<string | null>(null)

  const loadSettings = useCallback(async () => {
    try {
      const data = await fetchPlatformSettings()
      const merged = { ...DEFAULT_PLATFORM_SETTINGS, ...(data || {}) }
      cachedSettings = merged
      setSettings(merged)
      setError(null)
    } catch (err: any) {
      console.warn('Impossible de charger les paramètres de la plateforme, utilisation des valeurs par défaut:', err?.message)
      setError(err?.message || 'Erreur chargement paramètres')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Si déjà en cache, on ne bloque pas mais on rafraîchit en tâche de fond
    if (!cachedSettings) {
      void loadSettings()
    } else {
      setLoading(false)
    }

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<PlatformSettings>
      if (customEvent.detail) {
        setSettings(customEvent.detail)
      } else {
        void loadSettings()
      }
    }

    window.addEventListener('colcampus:settings-updated', handleUpdate)
    return () => {
      window.removeEventListener('colcampus:settings-updated', handleUpdate)
    }
  }, [loadSettings])

  return {
    settings,
    loading,
    error,
    refreshSettings: loadSettings,
  }
}

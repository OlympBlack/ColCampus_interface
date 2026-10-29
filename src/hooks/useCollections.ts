import { useCallback, useEffect, useState } from 'react'
import { PROPERTY_COLLECTIONS } from '../constants'
import { fetchCollections } from '../services/api'
import type { PropertyCollection } from '../types'

export function useCollections() {
  const [collections, setCollections] = useState<PropertyCollection[]>(() => [...PROPERTY_COLLECTIONS])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCollections = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetchCollections()
      if (response.data && response.data.length > 0) {
        // Normalize properties
        const normalized = response.data.map((c) => ({
          ...c,
          roomTypeValue: c.room_type_value ?? (c as any).roomTypeValue,
          priceRange: c.price_range ?? (c as any).priceRange,
          fallbackCount: c.properties_count ?? c.fallback_count ?? (c as any).fallbackCount,
          heroBanner: c.hero_banner ?? (c as any).heroBanner,
          heroDescription: c.hero_description ?? (c as any).heroDescription,
          idealFor: c.ideal_for ?? (c as any).idealFor,
          avgRent: c.avg_rent ?? (c as any).avgRent,
        }))
        setCollections(normalized)
      }
      setError(null)
    } catch (err) {
      console.warn('Impossible de charger les collections depuis l API, utilisation des collections locales :', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      // Keeps PROPERTY_COLLECTIONS
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadCollections()
  }, [loadCollections])

  return {
    collections,
    isLoading,
    error,
    refetch: loadCollections,
  }
}

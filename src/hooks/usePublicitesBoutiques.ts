import { useEffect, useState } from 'react'
import { fetchPublicitesBoutiques } from '../services/api'
import type { PubliciteBoutique } from '../types'

export function usePublicitesBoutiques(quartier?: string) {
  const [publicites, setPublicites] = useState<PubliciteBoutique[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    fetchPublicitesBoutiques(quartier)
      .then((response) => {
        if (!cancelled) {
          setPublicites(response.data)
          setIsLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setPublicites([])
          setError(err.message)
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [quartier])

  return { publicites, isLoading, error }
}

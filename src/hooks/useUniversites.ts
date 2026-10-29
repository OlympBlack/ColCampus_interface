import { useEffect, useState } from 'react'
import { QUARTIER_OPTIONS } from '../constants'
import { fetchQuartiers, fetchUniversities } from '../services/api'
import type { Quartier, Universite } from '../types'

export function useUniversites() {
  const [universities, setUniversities] = useState<Universite[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchUniversities()
      .then((response) => {
        if (!cancelled) {
          setUniversities(response.data)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUniversities([])
          setIsLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { universities, isLoading }
}

export function useQuartiers(universite?: string, universiteId?: number | string) {
  const [quartiers, setQuartiers] = useState<Quartier[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if ((!universite || universite === '') && (universiteId === undefined || universiteId === null || universiteId === '')) {
      setQuartiers([])
      return
    }
    let cancelled = false
    setIsLoading(true)
    fetchQuartiers(universite, universiteId)
      .then((response) => {
        if (!cancelled) {
          setQuartiers(response.data)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setQuartiers([])
          setIsLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [universite, universiteId])

  return { quartiers, isLoading }
}

export function useQuartierNames(universite?: string, universiteId?: number | string): string[] {
  const [quartiers, setQuartiers] = useState<Quartier[]>([])

  useEffect(() => {
    let cancelled = false
    fetchQuartiers(universite, universiteId)
      .then((response) => {
        if (!cancelled) setQuartiers(response.data)
      })
      .catch(() => {
        if (!cancelled) setQuartiers([])
      })
    return () => {
      cancelled = true
    }
  }, [universite, universiteId])

  if (quartiers.length === 0) {
    return QUARTIER_OPTIONS
  }

  const seen = new Set<string>()
  const names: string[] = []
  quartiers.forEach((quartier) => {
    if (!seen.has(quartier.nom)) {
      seen.add(quartier.nom)
      names.push(quartier.nom)
    }
  })

  return names
}

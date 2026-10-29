import { useDeferredValue, useEffect, useState } from 'react'
import { fetchAvisList, fetchMyAvis } from '../services/api'
import type { AuthSession, Avis, AvisFilters, AvisListMeta } from '../types'

export function useAvis(filters: AvisFilters = {}) {
  const deferredFilters = useDeferredValue(filters)
  const requestKey = JSON.stringify(deferredFilters)
  const [avis, setAvis] = useState<Avis[]>([])
  const [meta, setMeta] = useState<AvisListMeta | null>(null)
  const [totalOuvertes, setTotalOuvertes] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    fetchAvisList(deferredFilters)
      .then((response) => {
        if (!cancelled) {
          setAvis(response.data)
          setMeta(response.meta)
          setTotalOuvertes(response.stats?.total_ouvertes ?? 0)
          setIsLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setAvis([])
          setMeta(null)
          setError(err.message)
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [requestKey, reloadToken])

  return {
    avis,
    meta,
    totalOuvertes,
    isLoading,
    error,
    reload: () => setReloadToken((value) => value + 1),
  }
}

export function useMyAvis(session: AuthSession | null) {
  const [myAvis, setMyAvis] = useState<Avis[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)

  const isEtudiant = session?.user.role === 'etudiant'

  useEffect(() => {
    if (!session?.token || !isEtudiant) {
      setMyAvis([])
      return
    }

    let cancelled = false
    setIsLoading(true)

    fetchMyAvis(session.token)
      .then((response) => {
        if (!cancelled) {
          setMyAvis(response.data)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMyAvis([])
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [session?.token, isEtudiant, reloadToken])

  return {
    myAvis,
    openAvis: myAvis.find((item) => item.statut === 'ouverte') ?? null,
    isLoading,
    reload: () => setReloadToken((value) => value + 1),
  }
}

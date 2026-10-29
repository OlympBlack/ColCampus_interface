import { useDeferredValue, useEffect, useState } from 'react'
import { fetchAnnouncement, fetchAnnouncements, fetchSimilarAnnouncements, type AnnouncementFilters } from '../services/api'
import { getStoredSession } from '../services/session'
import type { Annonce } from '../types'

export function useAnnouncements(filters: AnnouncementFilters = {}) {
  const deferredFilters = useDeferredValue(filters)
  const requestKey = JSON.stringify(deferredFilters)
  const [announcements, setAnnouncements] = useState<Annonce[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    const token = getStoredSession()?.token

    fetchAnnouncements(deferredFilters, token)
      .then((response) => {
        if (!cancelled) {
          setAnnouncements(response.data)
          setIsLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setAnnouncements([])
          setError(err.message)
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [requestKey])

  return { announcements, isLoading, error }
}

export function useAnnouncement(annonceId: number, token?: string) {
  const [announcement, setAnnouncement] = useState<Annonce | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    fetchAnnouncement(annonceId, token)
      .then((response) => {
        if (!cancelled) {
          setAnnouncement(response.data)
          setIsLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setAnnouncement(null)
          setError(err.message)
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [annonceId, token])

  return { announcement, isLoading, error }
}

export function useSimilarAnnouncements(annonceId: number, limit = 6) {
  const [announcements, setAnnouncements] = useState<Annonce[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    fetchSimilarAnnouncements(annonceId, limit)
      .then((response) => {
        if (!cancelled) {
          setAnnouncements(response.data)
          setIsLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setAnnouncements([])
          setError(err.message)
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [annonceId, limit])

  return { announcements, isLoading, error }
}

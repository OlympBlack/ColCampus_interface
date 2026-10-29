import { useEffect, useState } from 'react'
import { fetchDashboard } from '../services/api'
import type { DashboardData } from '../types'

export function useDashboard(token: string) {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    fetchDashboard(token)
      .then((response) => {
        if (!cancelled) {
          setDashboard(response.data)
          setIsLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setDashboard(null)
          setError(err.message)
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [token])

  return { dashboard, setDashboard, isLoading, error }
}

import { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/stores/redux'
import {
  fetchDashboardData,
  // fetchCurrentMonthBudgetStats,
  clearDashboardError,
  clearDashboardData,
  // DashboardState
} from '@/stores/redux'
import { useAuth } from './use-auth'

export function useDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { token } = useAuth()
  
  const {
    data: dashboardData,
    currentMonthBudgetStats,
    isLoading,
    error,
    lastFetched
  } = useSelector((state: RootState) => state.dashboard)

  // Auto-fetch dashboard data on mount and when auth changes
  useEffect(() => {
    if (token) {
      dispatch(fetchDashboardData())
      // dispatch(fetchCurrentMonthBudgetStats())
    }
  }, [dispatch, token])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!token || !lastFetched) return

    const interval = setInterval(() => {
      dispatch(fetchDashboardData())
      // dispatch(fetchCurrentMonthBudgetStats())
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [dispatch, token, lastFetched])

  const refreshDashboard = useCallback(() => {
    if (token) {
      dispatch(fetchDashboardData())
      // dispatch(fetchCurrentMonthBudgetStats())
    }
  }, [dispatch, token])

  const clearDashboardErrorCallback = useCallback(() => {
    dispatch(clearDashboardError())
  }, [dispatch])

  const clearData = useCallback(() => {
    dispatch(clearDashboardData())
  }, [dispatch])

  return {
    dashboardData,
    currentMonthBudgetStats,
    isLoading,
    error,
    lastFetched,
    refreshDashboard,
    clearDashboardError: clearDashboardErrorCallback,
    clearData
  }
}
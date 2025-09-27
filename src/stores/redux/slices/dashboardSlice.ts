import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { makeApiRequest, formatApiError } from '@/lib/api-response'
import { 
  DashboardApiResponse, 
  DashboardData,
  CurrentMonthBudgetStats,
  CurrentMonthBudgetStatsApiResponse
} from '@/types/dashboard'

export interface DashboardState {
  data: DashboardData | null
  currentMonthBudgetStats: CurrentMonthBudgetStats | null
  isLoading: boolean
  error: string | null
  lastFetched: number | null
}

const initialState: DashboardState = {
  data: null,
  currentMonthBudgetStats: null,
  isLoading: false,
  error: null,
  lastFetched: null,
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Async thunk for fetching dashboard data
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token
      
      if (!token) {
        throw new Error('No authentication token available')
      }

      const data = await makeApiRequest<DashboardData>(
        `${API_BASE_URL}/api/reports/dashboard`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      // Return the data directly as it matches the DashboardData interface
      return data
    } catch (error) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

// Async thunk for fetching current month budget stats
export const fetchCurrentMonthBudgetStats = createAsyncThunk(
  'dashboard/fetchCurrentMonthBudgetStats',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token
      
      if (!token) {
        throw new Error('No authentication token available')
      }

      const data = await makeApiRequest<CurrentMonthBudgetStats>(
        `${API_BASE_URL}/api/reports/current-month-budget-stats`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      // Return the data directly as it matches the CurrentMonthBudgetStats interface
      return data
    } catch (error) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearDashboardData: (state) => {
      state.data = null
      state.currentMonthBudgetStats = null
      state.lastFetched = null
    },
  },
  extraReducers: (builder) => {
    // Fetch dashboard data
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardData.fulfilled, (state, action: PayloadAction<DashboardData>) => {
        state.isLoading = false
        state.data = action.payload
        state.error = null
        state.lastFetched = Date.now()
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch current month budget stats
    builder
      .addCase(fetchCurrentMonthBudgetStats.pending, (state) => {
        // Don't set loading for this secondary call
      })
      .addCase(fetchCurrentMonthBudgetStats.fulfilled, (state, action: PayloadAction<CurrentMonthBudgetStats>) => {
        // Store current month budget stats separately
        state.currentMonthBudgetStats = action.payload
      })
      .addCase(fetchCurrentMonthBudgetStats.rejected, (state, action) => {
        // Don't override main error for this secondary call
        console.error('Failed to fetch current month budget stats:', action.payload)
      })
  },
})

export const { clearError, clearDashboardData } = dashboardSlice.actions
export { dashboardSlice }
export default dashboardSlice.reducer
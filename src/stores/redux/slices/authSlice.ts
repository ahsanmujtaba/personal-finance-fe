import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { makeApiRequest, formatApiError } from '@/lib/api-response'

// Types
export interface User {
  id: number
  name: string
  email: string
  avatar?: string | null
  currency_code?: string
  timezone?: string
  provider?: string | null
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface UpdateProfileData {
  name?: string
  email?: string
  currency_code?: string
  timezone?: string
  avatar?: string
}

export interface UpdatePasswordData {
  current_password?: string
  new_password: string
  new_password_confirmation: string
}

export interface AuthResponse {
  user: User
  token: string
  token_type?: string
}

// Initial state
// Helper function to safely get user data from localStorage
const getUserFromStorage = (): User | null => {
  try {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.warn('Failed to parse user data from localStorage:', error)
    return null
  }
}

const initialState: AuthState = {
  user: getUserFromStorage(),
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,
}

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const data = await makeApiRequest<AuthResponse>(
        `${API_BASE_URL}/api/login`,
        {
          method: 'POST',
          body: JSON.stringify(credentials),
        }
      )

      // Store token in localStorage
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))

      return data
    } catch (error) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const data = await makeApiRequest<AuthResponse>(
        `${API_BASE_URL}/api/register`,
        {
          method: 'POST',
          body: JSON.stringify(credentials),
        }
      )

      // Store token in localStorage
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))

      return data
    } catch (error) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState }
      const token = state.auth.token

      if (token) {
        await makeApiRequest(
          `${API_BASE_URL}/api/logout`,
          {
            method: 'POST',
          },
          token
        )
      }

      // Clear localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      
      return { message: 'Logged out successfully' }
    } catch (error: any) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      return rejectWithValue(formatApiError(error))
    }
  }
)

export const logoutAllDevices = createAsyncThunk(
  'auth/logoutAll',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState }
      const token = state.auth.token

      if (token) {
        await makeApiRequest(
          `${API_BASE_URL}/api/logout-all`,
          {
            method: 'POST',
          },
          token
        )
      }

      // Clear localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')

      return { message: 'Logged out from all devices successfully' }
    } catch (error: any) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      return rejectWithValue(formatApiError(error))
    }
  }
)

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState }
      const token = state.auth.token

      if (!token) {
        return rejectWithValue('No token available')
      }

      const data = await makeApiRequest<User>(
        `${API_BASE_URL}/api/profile`,
        {
          method: 'GET',
        },
        token
      )

      // Update user data in localStorage
      localStorage.setItem('user_data', JSON.stringify(data))

      return data
    } catch (error) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: UpdateProfileData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState }
      const token = state.auth.token

      if (!token) {
        return rejectWithValue('No token available')
      }

      const data = await makeApiRequest<User>(
        `${API_BASE_URL}/api/profile`,
        {
          method: 'PUT',
          body: JSON.stringify(profileData),
        },
        token
      )

      // Update user data in localStorage
      localStorage.setItem('user_data', JSON.stringify(data))

      return data
    } catch (error) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

export const updateUserPassword = createAsyncThunk(
  'auth/updatePassword',
  async (passwordData: UpdatePasswordData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState }
      const token = state.auth.token

      if (!token) {
        return rejectWithValue('No token available')
      }

      await makeApiRequest(
        `${API_BASE_URL}/api/password`,
        {
          method: 'PUT',
          body: JSON.stringify(passwordData),
        },
        token
      )

      return { message: 'Password updated successfully' }
    } catch (error) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem('auth_token')
      const userData = getUserFromStorage()
      
      if (token) {
        state.token = token
        state.isAuthenticated = true
        
        // Load user data if available, otherwise keep existing user data
        if (userData) {
          state.user = userData
        }
      } else {
        // No token means user is not authenticated
        state.token = null
        state.user = null
        state.isAuthenticated = false
      }
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })

    // Logout All Devices
    builder
      .addCase(logoutAllDevices.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(logoutAllDevices.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(logoutAllDevices.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })

    // Fetch Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        // If profile fetch fails, might be due to invalid token
        if (action.payload === 'No token available') {
          state.user = null
          state.token = null
          state.isAuthenticated = false
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_data')
        }
      })

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Update Password
    builder
      .addCase(updateUserPassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserPassword.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, loadUserFromStorage, clearAuth } = authSlice.actions
export { authSlice }
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/stores/redux/hooks'
import {
  loginUser,
  registerUser,
  logoutUser,
  logoutAllDevices,
  fetchUserProfile,
  updateUserProfile,
  updateUserPassword,
  clearAuthError,
  loadUserFromStorage,
  clearAuth,
  type LoginCredentials,
  type RegisterCredentials,
  type UpdateProfileData,
  type UpdatePasswordData,
} from '@/stores/redux'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  )

  // Load user from localStorage on hook initialization
  useEffect(() => {
    dispatch(loadUserFromStorage())
  }, [dispatch])

  // Auto-fetch user profile if token exists but no user data
  useEffect(() => {
    if (token && !user && isAuthenticated) {
      dispatch(fetchUserProfile())
    }
  }, [dispatch, token, user, isAuthenticated])

  const login = async (credentials: LoginCredentials) => {
    try {
      const result = await dispatch(loginUser(credentials))
      
      if (loginUser.fulfilled.match(result)) {
        return { success: true, data: result.payload }
      } else {
        return { success: false, error: result.payload as string }
      }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      const result = await dispatch(registerUser(credentials))
      if (registerUser.fulfilled.match(result)) {
        return { success: true, data: result.payload }
      } else {
        return { success: false, error: result.payload as string }
      }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const logout = async () => {
    try {
      await dispatch(logoutUser())
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Logout failed' }
    }
  }

  const logoutFromAllDevices = async () => {
    try {
      await dispatch(logoutAllDevices())
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Logout from all devices failed' }
    }
  }

  const refreshProfile = async () => {
    try {
      const result = await dispatch(fetchUserProfile())
      if (fetchUserProfile.fulfilled.match(result)) {
        return { success: true, data: result.payload }
      } else {
        return { success: false, error: result.payload as string }
      }
    } catch (error) {
      return { success: false, error: 'Failed to refresh profile' }
    }
  }

  const updateProfile = async (profileData: UpdateProfileData) => {
    try {
      const result = await dispatch(updateUserProfile(profileData))
      if (updateUserProfile.fulfilled.match(result)) {
        return { success: true, data: result.payload }
      } else {
        return { success: false, error: result.payload as string }
      }
    } catch (error) {
      return { success: false, error: 'Failed to update profile' }
    }
  }

  const updatePassword = async (passwordData: UpdatePasswordData) => {
    try {
      const result = await dispatch(updateUserPassword(passwordData))
      if (updateUserPassword.fulfilled.match(result)) {
        return { success: true, message: result.payload.message }
      } else {
        return { success: false, error: result.payload as string }
      }
    } catch (error) {
      return { success: false, error: 'Failed to update password' }
    }
  }

  const clearAuthErrorCallback = () => {
    dispatch(clearAuthError())
  }

  const forceLogout = () => {
    dispatch(clearAuth())
  }

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    logoutFromAllDevices,
    refreshProfile,
    updateProfile,
    updatePassword,
    clearAuthError: clearAuthErrorCallback,
    forceLogout,
    
    // Computed values
    isLoggedIn: isAuthenticated && !!user,
    hasToken: !!token,
  }
}

export type UseAuthReturn = ReturnType<typeof useAuth>
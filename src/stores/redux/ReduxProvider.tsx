import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import { loadUserFromStorage, clearAuth } from './slices/authSlice'

interface ReduxProviderProps {
  children: React.ReactNode
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load auth state from localStorage on app startup
    store.dispatch(loadUserFromStorage())
    
    // Listen for unauthorized events and clear auth state
    const handleUnauthorized = () => {
      store.dispatch(clearAuth())
    }
    
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [])

  return <>{children}</>
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  )
}
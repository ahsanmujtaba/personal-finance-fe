import { Navigate, useLocation } from '@tanstack/react-router'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  fallback,
  redirectTo = '/sign-in' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, token } = useAuth()
  const location = useLocation()
  


  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      )
    )
  }

  // If not authenticated or no token, redirect to sign-in
  if (!isAuthenticated || !token) {
    return (
      <Navigate 
        to={redirectTo} 
        search={{ 
          redirect: location.pathname + location.search 
        }}
        replace
      />
    )
  }

  // If authenticated but no user data, show loading
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    )
  }

  // User is authenticated, render children
  return <>{children}</>
}

// Higher-order component version for easier usage
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ReactNode
    redirectTo?: string
  }
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute 
        fallback={options?.fallback}
        redirectTo={options?.redirectTo}
      >
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}
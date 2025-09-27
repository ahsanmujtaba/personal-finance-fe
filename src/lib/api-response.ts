// Standardized API Response Types and Utilities
// Based on API_Response_Samples.md

export interface StandardApiResponse<T = any> {
  success: boolean
  message: string
  data: T | null
  errors: Record<string, string[]> | null
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

/**
 * Processes a standardized API response and extracts the data or throws an error
 * @param response - The fetch response object
 * @returns Promise<T> - The extracted data from response.data
 * @throws ApiError - If the response indicates failure
 */
export async function processApiResponse<T>(response: Response): Promise<T> {
  const responseData: StandardApiResponse<T> = await response.json()
  
  // Check if the response follows the standardized format
  if (typeof responseData.success !== 'boolean') {
    // Fallback for non-standardized responses (backward compatibility)
    if (response.ok) {
      return responseData as unknown as T
    } else {
      throw {
        message: 'Request failed',
        status: response.status
      } as ApiError
    }
  }
  
  // Handle standardized response format
  if (!responseData.success) {
    throw {
      message: responseData.message,
      errors: responseData.errors || undefined,
      status: response.status
    } as ApiError
  }
  
  return responseData.data as T
}

/**
 * Formats an error for Redux rejection
 * @param error - The caught error (ApiError or generic error)
 * @returns string - Formatted error message for display
 */
export function formatApiError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const apiError = error as ApiError
    
    // If there are validation errors, format them
    if (apiError.errors) {
      const errorMessages = Object.values(apiError.errors)
        .flat()
        .join(', ')
      return `${apiError.message}: ${errorMessages}`
    }
    
    return apiError.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return 'An unexpected error occurred'
}

/**
 * Creates standardized headers for API requests
 * @param token - Optional authentication token
 * @returns Headers object
 */
export function createApiHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

/**
 * Makes an authenticated API request with standardized response handling
 * @param url - The API endpoint URL
 * @param options - Fetch options (method, body, etc.)
 * @param token - Authentication token
 * @returns Promise<T> - The extracted data
 */
export async function makeApiRequest<T>(
  url: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers = createApiHeaders(token)
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  })
  
  // Handle 401 Unauthorized responses
  if (response.status === 401) {
    // Clear Redux auth state
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    
    // Dispatch custom event for auth state cleanup
    window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    
    throw {
      message: 'Session expired. Please log in again.',
      status: 401
    } as ApiError
  }
  
  return processApiResponse<T>(response)
}
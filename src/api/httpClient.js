import axios from 'axios'

/**
 * Fired when a refresh attempt fails (expired/invalid refresh token) so the
 * Redux store can clear the session without httpClient importing the store
 * directly (that would create httpClient -> store -> authSlice -> authApi ->
 * httpClient circular imports).
 */
export const AUTH_EXPIRED_EVENT = 'learn-app:auth-expired'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

const httpClient = axios.create({ baseURL })

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshPromise = null

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) throw new Error('No refresh token available')
  // Plain axios (not httpClient) so this call never re-enters the response
  // interceptor below.
  const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken })
  localStorage.setItem('accessToken', data.accessToken)
  return data.accessToken
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error
    const isAuthEndpoint = config?.url?.startsWith('/auth/')

    if (response?.status === 401 && config && !config._retry && !isAuthEndpoint) {
      config._retry = true
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null
        })
        const accessToken = await refreshPromise
        config.headers.Authorization = `Bearer ${accessToken}`
        return httpClient(config)
      } catch (refreshError) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('username')
        localStorage.removeItem('role')
        window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

/** Reads the backend's ErrorResponse / validation-errors shape into one message. */
export function extractErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data
  if (!data) return error?.message || fallback
  if (data.errors && typeof data.errors === 'object') {
    const messages = Object.values(data.errors)
    if (messages.length) return messages.join(' ')
  }
  return data.message || fallback
}

/** Drops undefined/null/empty-string values so optional search filters aren't sent as empty params. */
export function compactParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
}

export default httpClient

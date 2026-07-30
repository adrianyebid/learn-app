import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createTestStore } from '../test-utils'
import { useAuth } from './AuthContext'

function wrapper(store) {
  return function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }
}

describe('useAuth', () => {
  it('reports unauthenticated with a null user when there is no token', () => {
    const store = createTestStore()
    const { result } = renderHook(() => useAuth(), { wrapper: wrapper(store) })
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('reports authenticated with a display user when a session exists', () => {
    const store = createTestStore({
      auth: {
        accessToken: 'at',
        refreshToken: 'rt',
        username: 'john.doe',
        role: 'ROLE_TRAINEE',
        status: 'succeeded',
        error: null,
        registration: { status: 'idle', error: null, result: null },
        changePasswordStatus: 'idle',
        changePasswordError: null,
      },
    })
    const { result } = renderHook(() => useAuth(), { wrapper: wrapper(store) })
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual({ name: 'john.doe' })
    expect(result.current.role).toBe('ROLE_TRAINEE')
  })

  it('treats a token without a username as unauthenticated instead of crashing consumers', () => {
    const store = createTestStore({
      auth: {
        accessToken: 'at',
        refreshToken: 'rt',
        username: null,
        role: null,
        status: 'succeeded',
        error: null,
        registration: { status: 'idle', error: null, result: null },
        changePasswordStatus: 'idle',
        changePasswordError: null,
      },
    })
    const { result } = renderHook(() => useAuth(), { wrapper: wrapper(store) })
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })
})

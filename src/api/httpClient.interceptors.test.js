import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requestUse, responseUse, rawPost } = vi.hoisted(() => ({
  requestUse: vi.fn(),
  responseUse: vi.fn(),
  rawPost: vi.fn(),
}))

vi.mock('axios', () => ({
  default: {
    create: () => ({
      interceptors: { request: { use: requestUse }, response: { use: responseUse } },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    }),
    post: (...args) => rawPost(...args),
  },
}))

import { AUTH_EXPIRED_EVENT } from './httpClient'

const requestInterceptor = () => requestUse.mock.calls[0][0]
const responseErrorInterceptor = () => responseUse.mock.calls[0][1]

beforeEach(() => {
  localStorage.clear()
  rawPost.mockReset()
})

describe('httpClient request interceptor', () => {
  it('attaches the stored access token as a Bearer header', () => {
    localStorage.setItem('accessToken', 'my-token')
    const config = requestInterceptor()({ headers: {} })
    expect(config.headers.Authorization).toBe('Bearer my-token')
  })

  it('leaves the header untouched when there is no stored token', () => {
    const config = requestInterceptor()({ headers: {} })
    expect(config.headers.Authorization).toBeUndefined()
  })
})

describe('httpClient response interceptor', () => {
  it('does not attempt a refresh for 401s from the auth endpoints themselves', async () => {
    const error = { config: { url: '/auth/login', headers: {} }, response: { status: 401 } }
    await expect(responseErrorInterceptor()(error)).rejects.toBe(error)
    expect(rawPost).not.toHaveBeenCalled()
  })

  it('passes non-401 errors straight through', async () => {
    const error = { config: { url: '/trainees', headers: {} }, response: { status: 500 } }
    await expect(responseErrorInterceptor()(error)).rejects.toBe(error)
  })

  it('clears the session and fires AUTH_EXPIRED_EVENT when the refresh call itself fails', async () => {
    localStorage.setItem('accessToken', 'stale')
    localStorage.setItem('refreshToken', 'refresh-me')
    rawPost.mockRejectedValue(new Error('refresh failed'))
    const listener = vi.fn()
    window.addEventListener(AUTH_EXPIRED_EVENT, listener)

    const error = { config: { url: '/trainees', headers: {} }, response: { status: 401 } }
    await expect(responseErrorInterceptor()(error)).rejects.toThrow('refresh failed')

    expect(localStorage.getItem('accessToken')).toBeNull()
    expect(listener).toHaveBeenCalledTimes(1)
    window.removeEventListener(AUTH_EXPIRED_EVENT, listener)
  })
})

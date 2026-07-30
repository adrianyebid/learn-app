import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./httpClient', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

import httpClient from './httpClient'
import * as authApi from './authApi'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('authApi', () => {
  it('login posts credentials and resolves with the response data', async () => {
    const data = { accessToken: 'a', refreshToken: 'r', tokenType: 'Bearer', role: 'ROLE_TRAINEE' }
    httpClient.post.mockResolvedValue({ data })
    const result = await authApi.login({ username: 'john', password: 'secret' })
    expect(httpClient.post).toHaveBeenCalledWith('/auth/login', { username: 'john', password: 'secret' })
    expect(result).toEqual(data)
  })

  it('refresh posts the refresh token', async () => {
    httpClient.post.mockResolvedValue({ data: { accessToken: 'new' } })
    await authApi.refresh('rt')
    expect(httpClient.post).toHaveBeenCalledWith('/auth/refresh', { refreshToken: 'rt' })
  })

  it('logout posts the refresh token', async () => {
    httpClient.post.mockResolvedValue({ data: {} })
    await authApi.logout('rt')
    expect(httpClient.post).toHaveBeenCalledWith('/auth/logout', { refreshToken: 'rt' })
  })

  it('changePassword PUTs username/oldPassword/newPassword', async () => {
    httpClient.put.mockResolvedValue({ data: {} })
    await authApi.changePassword({ username: 'john', oldPassword: 'old', newPassword: 'new' })
    expect(httpClient.put).toHaveBeenCalledWith('/auth/change-password', {
      username: 'john',
      oldPassword: 'old',
      newPassword: 'new',
    })
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'

vi.mock('../api/authApi')
vi.mock('../api/traineesApi')
vi.mock('../api/trainersApi')

import * as authApi from '../api/authApi'
import * as traineesApi from '../api/traineesApi'
import authReducer, { changePassword, login, logout, registerTrainee, sessionExpired } from './authSlice'

const LOGGED_IN_STATE = {
  accessToken: 'at',
  refreshToken: 'rt',
  username: 'john.doe',
  role: 'ROLE_TRAINEE',
  status: 'succeeded',
  error: null,
  registration: { status: 'idle', error: null, result: null },
  changePasswordStatus: 'idle',
  changePasswordError: null,
}

function buildStore(authState) {
  return configureStore({ reducer: { auth: authReducer }, preloadedState: authState && { auth: authState } })
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

describe('authSlice', () => {
  it('login success stores the session and persists it to localStorage', async () => {
    authApi.login.mockResolvedValue({ accessToken: 'at', refreshToken: 'rt', tokenType: 'Bearer', role: 'ROLE_TRAINEE' })
    const store = buildStore()
    await store.dispatch(login({ username: 'john.doe', password: 'secret' }))
    const state = store.getState().auth
    expect(state.accessToken).toBe('at')
    expect(state.username).toBe('john.doe')
    expect(state.role).toBe('ROLE_TRAINEE')
    expect(localStorage.getItem('accessToken')).toBe('at')
  })

  it('login failure sets the error and leaves the session empty', async () => {
    authApi.login.mockRejectedValue({ response: { data: { message: 'Invalid username or password' } } })
    const store = buildStore()
    await store.dispatch(login({ username: 'john.doe', password: 'wrong' }))
    const state = store.getState().auth
    expect(state.status).toBe('failed')
    expect(state.error).toBe('Invalid username or password')
    expect(state.accessToken).toBeNull()
  })

  it('registerTrainee stores the generated credentials under registration.result', async () => {
    traineesApi.registerTrainee.mockResolvedValue({ username: 'john.doe', password: 'gen123' })
    const store = buildStore()
    await store.dispatch(registerTrainee({ firstName: 'John', lastName: 'Doe' }))
    expect(store.getState().auth.registration).toEqual({
      status: 'succeeded',
      error: null,
      result: { username: 'john.doe', password: 'gen123', role: 'ROLE_TRAINEE' },
    })
  })

  it('registerTrainee failure records the error without a result', async () => {
    traineesApi.registerTrainee.mockRejectedValue({ response: { data: { message: 'First name is required' } } })
    const store = buildStore()
    await store.dispatch(registerTrainee({ firstName: '', lastName: 'Doe' }))
    const { registration } = store.getState().auth
    expect(registration.status).toBe('failed')
    expect(registration.error).toBe('First name is required')
    expect(registration.result).toBeNull()
  })

  it('logout clears the session even though the API call is best-effort', async () => {
    authApi.logout.mockResolvedValue({})
    const store = buildStore(LOGGED_IN_STATE)
    await store.dispatch(logout())
    const state = store.getState().auth
    expect(state.accessToken).toBeNull()
    expect(state.username).toBeNull()
  })

  it('sessionExpired reducer clears the session synchronously (401-refresh-failed path)', () => {
    localStorage.setItem('accessToken', 'at')
    const store = buildStore(LOGGED_IN_STATE)
    store.dispatch(sessionExpired())
    expect(store.getState().auth.accessToken).toBeNull()
    expect(localStorage.getItem('accessToken')).toBeNull()
  })

  it('changePassword success/failure toggle changePasswordStatus accordingly', async () => {
    authApi.changePassword.mockResolvedValueOnce({})
    const store = buildStore(LOGGED_IN_STATE)
    await store.dispatch(changePassword({ oldPassword: 'old', newPassword: 'newpass1' }))
    expect(store.getState().auth.changePasswordStatus).toBe('succeeded')

    authApi.changePassword.mockRejectedValueOnce({ response: { data: { message: 'Current password is required' } } })
    await store.dispatch(changePassword({ oldPassword: '', newPassword: 'newpass1' }))
    const state = store.getState().auth
    expect(state.changePasswordStatus).toBe('failed')
    expect(state.changePasswordError).toBe('Current password is required')
  })
})

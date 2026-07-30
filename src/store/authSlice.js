import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as authApi from '../api/authApi'
import * as traineesApi from '../api/traineesApi'
import * as trainersApi from '../api/trainersApi'
import { extractErrorMessage } from '../api/httpClient'

const persistSession = ({ accessToken, refreshToken, username, role }) => {
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)
  localStorage.setItem('username', username)
  localStorage.setItem('role', role)
}

const clearSession = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('username')
  localStorage.removeItem('role')
}

export const login = createAsyncThunk('auth/login', async ({ username, password }, { rejectWithValue }) => {
  try {
    const data = await authApi.login({ username, password })
    // AuthResponseDTO doesn't echo the username back, so we carry the one the user typed.
    return { ...data, username }
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'Invalid username or password'))
  }
})

export const registerTrainee = createAsyncThunk(
  'auth/registerTrainee',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await traineesApi.registerTrainee(payload)
      return { ...data, role: 'ROLE_TRAINEE' }
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

export const registerTrainer = createAsyncThunk(
  'auth/registerTrainer',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await trainersApi.registerTrainer(payload)
      return { ...data, role: 'ROLE_TRAINER' }
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ oldPassword, newPassword }, { getState, rejectWithValue }) => {
    try {
      const { username } = getState().auth
      await authApi.changePassword({ username, oldPassword, newPassword })
      return true
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

export const logout = createAsyncThunk('auth/logout', async (_, { getState }) => {
  const { refreshToken } = getState().auth
  if (refreshToken) {
    await authApi.logout(refreshToken).catch(() => {})
  }
  return null
})

const initialState = {
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  username: localStorage.getItem('username'),
  role: localStorage.getItem('role'),
  status: 'idle',
  error: null,
  registration: { status: 'idle', error: null, result: null },
  changePasswordStatus: 'idle',
  changePasswordError: null,
}

const isRegisterPending = (action) =>
  action.type === registerTrainee.pending.type || action.type === registerTrainer.pending.type
const isRegisterFulfilled = (action) =>
  action.type === registerTrainee.fulfilled.type || action.type === registerTrainer.fulfilled.type
const isRegisterRejected = (action) =>
  action.type === registerTrainee.rejected.type || action.type === registerTrainer.rejected.type

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionExpired(state) {
      clearSession()
      state.accessToken = null
      state.refreshToken = null
      state.username = null
      state.role = null
    },
    resetRegistration(state) {
      state.registration = { status: 'idle', error: null, result: null }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        const { accessToken, refreshToken, role, username } = action.payload
        state.status = 'succeeded'
        state.accessToken = accessToken
        state.refreshToken = refreshToken
        state.role = role
        state.username = username
        persistSession({ accessToken, refreshToken, username, role })
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        clearSession()
        state.accessToken = null
        state.refreshToken = null
        state.username = null
        state.role = null
        state.status = 'idle'
      })
      .addCase(changePassword.pending, (state) => {
        state.changePasswordStatus = 'loading'
        state.changePasswordError = null
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changePasswordStatus = 'succeeded'
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePasswordStatus = 'failed'
        state.changePasswordError = action.payload
      })
      .addMatcher(isRegisterPending, (state) => {
        state.registration.status = 'loading'
        state.registration.error = null
      })
      .addMatcher(isRegisterFulfilled, (state, action) => {
        state.registration.status = 'succeeded'
        state.registration.result = action.payload
      })
      .addMatcher(isRegisterRejected, (state, action) => {
        state.registration.status = 'failed'
        state.registration.error = action.payload
      })
  },
})

export const { sessionExpired, resetRegistration } = authSlice.actions
export const selectIsAuthenticated = (state) => Boolean(state.auth.accessToken)
export default authSlice.reducer

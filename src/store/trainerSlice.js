import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as trainersApi from '../api/trainersApi'
import { extractErrorMessage } from '../api/httpClient'

export const fetchTrainerProfile = createAsyncThunk(
  'trainer/fetchProfile',
  async (username, { rejectWithValue }) => {
    try {
      return await trainersApi.getTrainerProfile(username)
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

export const updateTrainerProfile = createAsyncThunk(
  'trainer/updateProfile',
  async (payload, { rejectWithValue }) => {
    try {
      return await trainersApi.updateTrainerProfile(payload)
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

export const deleteTrainerAccount = createAsyncThunk(
  'trainer/deleteAccount',
  async (username, { rejectWithValue }) => {
    try {
      await trainersApi.deleteTrainer(username)
      return username
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

export const fetchTrainerTrainees = createAsyncThunk(
  'trainer/fetchTrainees',
  async (username, { rejectWithValue }) => {
    try {
      return await trainersApi.getTrainerTrainees(username)
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

export const searchTrainerTrainings = createAsyncThunk(
  'trainer/searchTrainings',
  async (filter, { rejectWithValue }) => {
    try {
      return await trainersApi.searchTrainerTrainings(filter)
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

const initialState = {
  profile: null,
  profileStatus: 'idle',
  profileError: null,
  trainees: [],
  traineesStatus: 'idle',
  trainings: [],
  trainingsStatus: 'idle',
  trainingsError: null,
  actionStatus: 'idle',
  actionError: null,
}

const isActionPending = (action) =>
  [updateTrainerProfile, deleteTrainerAccount].some((t) => action.type === t.pending.type)
const isActionFulfilled = (action) =>
  [updateTrainerProfile, deleteTrainerAccount].some((t) => action.type === t.fulfilled.type)
const isActionRejected = (action) =>
  [updateTrainerProfile, deleteTrainerAccount].some((t) => action.type === t.rejected.type)

const trainerSlice = createSlice({
  name: 'trainer',
  initialState,
  reducers: {
    resetTrainerState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainerProfile.pending, (state) => {
        state.profileStatus = 'loading'
        state.profileError = null
      })
      .addCase(fetchTrainerProfile.fulfilled, (state, action) => {
        state.profileStatus = 'succeeded'
        state.profile = action.payload
      })
      .addCase(fetchTrainerProfile.rejected, (state, action) => {
        state.profileStatus = 'failed'
        state.profileError = action.payload
      })
      .addCase(updateTrainerProfile.fulfilled, (state, action) => {
        state.profile = action.payload
      })
      .addCase(fetchTrainerTrainees.pending, (state) => {
        state.traineesStatus = 'loading'
      })
      .addCase(fetchTrainerTrainees.fulfilled, (state, action) => {
        state.traineesStatus = 'succeeded'
        state.trainees = action.payload
      })
      .addCase(searchTrainerTrainings.pending, (state) => {
        state.trainingsStatus = 'loading'
        state.trainingsError = null
      })
      .addCase(searchTrainerTrainings.fulfilled, (state, action) => {
        state.trainingsStatus = 'succeeded'
        state.trainings = action.payload
      })
      .addCase(searchTrainerTrainings.rejected, (state, action) => {
        state.trainingsStatus = 'failed'
        state.trainingsError = action.payload
      })
      .addMatcher(isActionPending, (state) => {
        state.actionStatus = 'loading'
        state.actionError = null
      })
      .addMatcher(isActionFulfilled, (state) => {
        state.actionStatus = 'succeeded'
      })
      .addMatcher(isActionRejected, (state, action) => {
        state.actionStatus = 'failed'
        state.actionError = action.payload
      })
  },
})

export const { resetTrainerState } = trainerSlice.actions
export default trainerSlice.reducer

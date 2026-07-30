import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as traineesApi from '../api/traineesApi'
import { extractErrorMessage } from '../api/httpClient'

export const fetchTraineeProfile = createAsyncThunk(
  'trainee/fetchProfile',
  async (username, { rejectWithValue }) => {
    try {
      return await traineesApi.getTraineeProfile(username)
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

export const updateTraineeProfile = createAsyncThunk(
  'trainee/updateProfile',
  async (payload, { rejectWithValue }) => {
    try {
      return await traineesApi.updateTraineeProfile(payload)
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

export const deleteTraineeAccount = createAsyncThunk(
  'trainee/deleteAccount',
  async (username, { rejectWithValue }) => {
    try {
      await traineesApi.deleteTrainee(username)
      return username
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

export const fetchUnassignedTrainers = createAsyncThunk(
  'trainee/fetchUnassignedTrainers',
  async (username, { rejectWithValue }) => {
    try {
      return await traineesApi.getUnassignedTrainers(username)
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

export const assignTrainers = createAsyncThunk(
  'trainee/assignTrainers',
  async (payload, { rejectWithValue }) => {
    try {
      return await traineesApi.assignTrainers(payload)
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

export const searchTraineeTrainings = createAsyncThunk(
  'trainee/searchTrainings',
  async (filter, { rejectWithValue }) => {
    try {
      return await traineesApi.searchTraineeTrainings(filter)
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

const initialState = {
  profile: null,
  profileStatus: 'idle',
  profileError: null,
  unassignedTrainers: [],
  unassignedTrainersStatus: 'idle',
  trainings: [],
  trainingsStatus: 'idle',
  trainingsError: null,
  actionStatus: 'idle',
  actionError: null,
}

const isActionPending = (action) =>
  [updateTraineeProfile, deleteTraineeAccount, assignTrainers].some((t) => action.type === t.pending.type)
const isActionFulfilled = (action) =>
  [updateTraineeProfile, deleteTraineeAccount, assignTrainers].some((t) => action.type === t.fulfilled.type)
const isActionRejected = (action) =>
  [updateTraineeProfile, deleteTraineeAccount, assignTrainers].some((t) => action.type === t.rejected.type)

const traineeSlice = createSlice({
  name: 'trainee',
  initialState,
  reducers: {
    resetTraineeState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTraineeProfile.pending, (state) => {
        state.profileStatus = 'loading'
        state.profileError = null
      })
      .addCase(fetchTraineeProfile.fulfilled, (state, action) => {
        state.profileStatus = 'succeeded'
        state.profile = action.payload
      })
      .addCase(fetchTraineeProfile.rejected, (state, action) => {
        state.profileStatus = 'failed'
        state.profileError = action.payload
      })
      .addCase(updateTraineeProfile.fulfilled, (state, action) => {
        state.profile = action.payload
      })
      .addCase(fetchUnassignedTrainers.pending, (state) => {
        state.unassignedTrainersStatus = 'loading'
      })
      .addCase(fetchUnassignedTrainers.fulfilled, (state, action) => {
        state.unassignedTrainersStatus = 'succeeded'
        state.unassignedTrainers = action.payload
      })
      .addCase(searchTraineeTrainings.pending, (state) => {
        state.trainingsStatus = 'loading'
        state.trainingsError = null
      })
      .addCase(searchTraineeTrainings.fulfilled, (state, action) => {
        state.trainingsStatus = 'succeeded'
        state.trainings = action.payload
      })
      .addCase(searchTraineeTrainings.rejected, (state, action) => {
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

export const { resetTraineeState } = traineeSlice.actions
export default traineeSlice.reducer

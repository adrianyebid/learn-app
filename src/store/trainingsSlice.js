import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as trainingsApi from '../api/trainingsApi'
import { extractErrorMessage } from '../api/httpClient'

export const createTraining = createAsyncThunk(
  'trainings/create',
  async (payload, { rejectWithValue }) => {
    try {
      return await trainingsApi.createTraining(payload)
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

const initialState = {
  createStatus: 'idle',
  createError: null,
}

const trainingsSlice = createSlice({
  name: 'trainings',
  initialState,
  reducers: {
    resetCreateStatus(state) {
      state.createStatus = 'idle'
      state.createError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTraining.pending, (state) => {
        state.createStatus = 'loading'
        state.createError = null
      })
      .addCase(createTraining.fulfilled, (state) => {
        state.createStatus = 'succeeded'
      })
      .addCase(createTraining.rejected, (state, action) => {
        state.createStatus = 'failed'
        state.createError = action.payload
      })
  },
})

export const { resetCreateStatus } = trainingsSlice.actions
export default trainingsSlice.reducer

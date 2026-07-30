import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as trainingTypesApi from '../api/trainingTypesApi'
import { extractErrorMessage } from '../api/httpClient'

// Training types double as trainer "specializations" in this domain, so this
// one cached list feeds both the registration and add-training combo boxes.
// `condition` skips the dispatch entirely once already loaded/in flight —
// checking inside the payload creator wouldn't work, since the thunk's own
// `pending` reducer already flips `status` to 'loading' before the payload
// creator body runs.
export const fetchTrainingTypes = createAsyncThunk(
  'trainingTypes/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await trainingTypesApi.getTrainingTypes()
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().trainingTypes
      return status !== 'succeeded' && status !== 'loading'
    },
  },
)

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const trainingTypesSlice = createSlice({
  name: 'trainingTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainingTypes.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchTrainingTypes.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        state.error = null
      })
      .addCase(fetchTrainingTypes.rejected, (state, action) => {
        if (action.meta.condition) return
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export default trainingTypesSlice.reducer

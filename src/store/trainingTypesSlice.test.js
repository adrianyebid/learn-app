import { beforeEach, describe, expect, it, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'

vi.mock('../api/trainingTypesApi')

import * as trainingTypesApi from '../api/trainingTypesApi'
import trainingTypesReducer, { fetchTrainingTypes } from './trainingTypesSlice'

function buildStore() {
  return configureStore({ reducer: { trainingTypes: trainingTypesReducer } })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('trainingTypesSlice', () => {
  it('fetches and caches the list, skipping a redundant second network call', async () => {
    trainingTypesApi.getTrainingTypes.mockResolvedValue([{ id: 1, name: 'Yoga' }])
    const store = buildStore()
    await store.dispatch(fetchTrainingTypes())
    expect(store.getState().trainingTypes.items).toEqual([{ id: 1, name: 'Yoga' }])

    await store.dispatch(fetchTrainingTypes())
    expect(trainingTypesApi.getTrainingTypes).toHaveBeenCalledTimes(1)
  })

  it('records the error on failure', async () => {
    trainingTypesApi.getTrainingTypes.mockRejectedValue({ message: 'Network Error' })
    const store = buildStore()
    await store.dispatch(fetchTrainingTypes())
    expect(store.getState().trainingTypes.status).toBe('failed')
    expect(store.getState().trainingTypes.error).toBe('Network Error')
  })
})

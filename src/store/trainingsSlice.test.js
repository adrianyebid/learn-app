import { beforeEach, describe, expect, it, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'

vi.mock('../api/trainingsApi')

import * as trainingsApi from '../api/trainingsApi'
import trainingsReducer, { createTraining, resetCreateStatus } from './trainingsSlice'

function buildStore() {
  return configureStore({ reducer: { trainings: trainingsReducer } })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('trainingsSlice', () => {
  it('createTraining succeeds', async () => {
    trainingsApi.createTraining.mockResolvedValue({ trainingId: 42 })
    const store = buildStore()
    await store.dispatch(
      createTraining({
        traineeUsername: 'j.doe',
        trainerUsername: 'a.b',
        trainingName: 'Yoga',
        trainingDate: '2026-01-01',
        trainingDuration: 60,
      }),
    )
    expect(store.getState().trainings.createStatus).toBe('succeeded')
  })

  it('createTraining records a validation error on failure', async () => {
    trainingsApi.createTraining.mockRejectedValue({
      response: { data: { errors: { trainingDuration: 'must be positive' } } },
    })
    const store = buildStore()
    await store.dispatch(createTraining({}))
    const state = store.getState().trainings
    expect(state.createStatus).toBe('failed')
    expect(state.createError).toBe('must be positive')
  })

  it('resetCreateStatus clears status and error back to idle', () => {
    const store = buildStore()
    store.dispatch(resetCreateStatus())
    expect(store.getState().trainings).toEqual({ createStatus: 'idle', createError: null })
  })
})

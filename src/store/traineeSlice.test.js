import { beforeEach, describe, expect, it, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'

vi.mock('../api/traineesApi')

import * as traineesApi from '../api/traineesApi'
import traineeReducer, {
  assignTrainers,
  deleteTraineeAccount,
  fetchTraineeProfile,
  fetchUnassignedTrainers,
  searchTraineeTrainings,
  updateTraineeProfile,
} from './traineeSlice'

function buildStore() {
  return configureStore({ reducer: { trainee: traineeReducer } })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('traineeSlice', () => {
  it('fetchTraineeProfile stores the profile on success', async () => {
    traineesApi.getTraineeProfile.mockResolvedValue({ firstName: 'John', lastName: 'Doe', isActive: true, trainers: [] })
    const store = buildStore()
    await store.dispatch(fetchTraineeProfile('john.doe'))
    const state = store.getState().trainee
    expect(state.profileStatus).toBe('succeeded')
    expect(state.profile.firstName).toBe('John')
  })

  it('fetchTraineeProfile records the error on failure', async () => {
    traineesApi.getTraineeProfile.mockRejectedValue({ response: { data: { message: 'Not found' } } })
    const store = buildStore()
    await store.dispatch(fetchTraineeProfile('missing'))
    const state = store.getState().trainee
    expect(state.profileStatus).toBe('failed')
    expect(state.profileError).toBe('Not found')
  })

  it('updateTraineeProfile replaces the stored profile with the response', async () => {
    traineesApi.updateTraineeProfile.mockResolvedValue({ username: 'john.doe', firstName: 'Jane', isActive: false })
    const store = buildStore()
    await store.dispatch(updateTraineeProfile({ username: 'john.doe', firstName: 'Jane', isActive: false }))
    const state = store.getState().trainee
    expect(state.profile.firstName).toBe('Jane')
    expect(state.actionStatus).toBe('succeeded')
  })

  it('deleteTraineeAccount surfaces a failure through actionError', async () => {
    traineesApi.deleteTrainee.mockRejectedValue({ response: { data: { message: 'Cannot delete' } } })
    const store = buildStore()
    await store.dispatch(deleteTraineeAccount('john.doe'))
    const state = store.getState().trainee
    expect(state.actionStatus).toBe('failed')
    expect(state.actionError).toBe('Cannot delete')
  })

  it('fetchUnassignedTrainers stores the returned list', async () => {
    traineesApi.getUnassignedTrainers.mockResolvedValue([{ username: 'a.b', specialization: 'Yoga' }])
    const store = buildStore()
    await store.dispatch(fetchUnassignedTrainers('john.doe'))
    expect(store.getState().trainee.unassignedTrainers).toHaveLength(1)
  })

  it('assignTrainers reports success through actionStatus', async () => {
    traineesApi.assignTrainers.mockResolvedValue({})
    const store = buildStore()
    await store.dispatch(assignTrainers({ traineeUsername: 'john.doe', trainerUsernames: ['a.b'] }))
    expect(store.getState().trainee.actionStatus).toBe('succeeded')
  })

  it('searchTraineeTrainings stores the results list', async () => {
    traineesApi.searchTraineeTrainings.mockResolvedValue([{ trainingName: 'Yoga' }])
    const store = buildStore()
    await store.dispatch(searchTraineeTrainings({ username: 'john.doe' }))
    expect(store.getState().trainee.trainings).toHaveLength(1)
    expect(store.getState().trainee.trainingsStatus).toBe('succeeded')
  })

  it('searchTraineeTrainings records the error on failure', async () => {
    traineesApi.searchTraineeTrainings.mockRejectedValue({ message: 'Network Error' })
    const store = buildStore()
    await store.dispatch(searchTraineeTrainings({ username: 'john.doe' }))
    expect(store.getState().trainee.trainingsStatus).toBe('failed')
    expect(store.getState().trainee.trainingsError).toBe('Network Error')
  })
})

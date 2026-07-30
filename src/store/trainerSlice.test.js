import { beforeEach, describe, expect, it, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'

vi.mock('../api/trainersApi')

import * as trainersApi from '../api/trainersApi'
import trainerReducer, {
  deleteTrainerAccount,
  fetchTrainerProfile,
  fetchTrainerTrainees,
  searchTrainerTrainings,
  updateTrainerProfile,
} from './trainerSlice'

function buildStore() {
  return configureStore({ reducer: { trainer: trainerReducer } })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('trainerSlice', () => {
  it('fetchTrainerProfile stores the profile on success', async () => {
    trainersApi.getTrainerProfile.mockResolvedValue({
      firstName: 'Ann',
      lastName: 'Lee',
      specialization: 'Yoga',
      isActive: true,
      trainees: [],
    })
    const store = buildStore()
    await store.dispatch(fetchTrainerProfile('ann.lee'))
    expect(store.getState().trainer.profile.specialization).toBe('Yoga')
  })

  it('updateTrainerProfile replaces the stored profile', async () => {
    trainersApi.updateTrainerProfile.mockResolvedValue({ username: 'ann.lee', firstName: 'Ann', isActive: false })
    const store = buildStore()
    await store.dispatch(updateTrainerProfile({ username: 'ann.lee', firstName: 'Ann', isActive: false }))
    expect(store.getState().trainer.profile.isActive).toBe(false)
    expect(store.getState().trainer.actionStatus).toBe('succeeded')
  })

  it('deleteTrainerAccount reports failures through actionError', async () => {
    trainersApi.deleteTrainer.mockRejectedValue({ message: 'Network Error' })
    const store = buildStore()
    await store.dispatch(deleteTrainerAccount('ann.lee'))
    expect(store.getState().trainer.actionStatus).toBe('failed')
    expect(store.getState().trainer.actionError).toBe('Network Error')
  })

  it('fetchTrainerTrainees stores the assigned trainees', async () => {
    trainersApi.getTrainerTrainees.mockResolvedValue([{ username: 'j.doe' }])
    const store = buildStore()
    await store.dispatch(fetchTrainerTrainees('ann.lee'))
    expect(store.getState().trainer.trainees).toHaveLength(1)
  })

  it('searchTrainerTrainings stores the results list', async () => {
    trainersApi.searchTrainerTrainings.mockResolvedValue([{ trainingName: 'Yoga' }])
    const store = buildStore()
    await store.dispatch(searchTrainerTrainings({ username: 'ann.lee' }))
    expect(store.getState().trainer.trainings).toHaveLength(1)
  })
})

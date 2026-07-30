import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./httpClient', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

import httpClient from './httpClient'
import * as trainingsApi from './trainingsApi'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('trainingsApi', () => {
  it('createTraining posts the training payload', async () => {
    httpClient.post.mockResolvedValue({ data: { trainingId: 1 } })
    const payload = { traineeUsername: 'j.doe', trainerUsername: 'a.b', trainingName: 'Yoga', trainingDate: '2026-01-01', trainingDuration: 60 }
    const result = await trainingsApi.createTraining(payload)
    expect(httpClient.post).toHaveBeenCalledWith('/trainings', payload)
    expect(result).toEqual({ trainingId: 1 })
  })

  it('deleteTraining DELETEs by id', async () => {
    httpClient.delete.mockResolvedValue({ data: {} })
    await trainingsApi.deleteTraining(42)
    expect(httpClient.delete).toHaveBeenCalledWith('/trainings/42')
  })
})

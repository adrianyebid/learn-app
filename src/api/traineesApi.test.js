import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./httpClient', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
  compactParams: (params) =>
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')),
}))

import httpClient from './httpClient'
import * as traineesApi from './traineesApi'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('traineesApi', () => {
  it('registerTrainee posts the trainee fields', async () => {
    httpClient.post.mockResolvedValue({ data: { username: 'j.doe', password: 'p' } })
    await traineesApi.registerTrainee({ firstName: 'John', lastName: 'Doe' })
    expect(httpClient.post).toHaveBeenCalledWith('/trainees', {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: undefined,
      address: undefined,
    })
  })

  it('getTraineeProfile GETs by username', async () => {
    httpClient.get.mockResolvedValue({ data: { firstName: 'John' } })
    await traineesApi.getTraineeProfile('j.doe')
    expect(httpClient.get).toHaveBeenCalledWith('/trainees/j.doe')
  })

  it('updateTraineeProfile PUTs the full payload', async () => {
    httpClient.put.mockResolvedValue({ data: {} })
    const payload = { username: 'j.doe', firstName: 'John', lastName: 'Doe', isActive: true }
    await traineesApi.updateTraineeProfile(payload)
    expect(httpClient.put).toHaveBeenCalledWith('/trainees', payload)
  })

  it('deleteTrainee DELETEs by username', async () => {
    httpClient.delete.mockResolvedValue({ data: {} })
    await traineesApi.deleteTrainee('j.doe')
    expect(httpClient.delete).toHaveBeenCalledWith('/trainees/j.doe')
  })

  it('getUnassignedTrainers GETs the not-assigned list', async () => {
    httpClient.get.mockResolvedValue({ data: [] })
    await traineesApi.getUnassignedTrainers('j.doe')
    expect(httpClient.get).toHaveBeenCalledWith('/trainees/j.doe/trainers/not-assigned')
  })

  it('assignTrainers PUTs the selected usernames', async () => {
    httpClient.put.mockResolvedValue({ data: {} })
    await traineesApi.assignTrainers({ traineeUsername: 'j.doe', trainerUsernames: ['a.b'] })
    expect(httpClient.put).toHaveBeenCalledWith('/trainees/trainers', {
      traineeUsername: 'j.doe',
      trainerUsernames: ['a.b'],
    })
  })

  it('searchTraineeTrainings GETs with compacted filter params', async () => {
    httpClient.get.mockResolvedValue({ data: [] })
    await traineesApi.searchTraineeTrainings({ username: 'j.doe', trainerUsername: '', periodFrom: undefined })
    expect(httpClient.get).toHaveBeenCalledWith('/trainees/trainings', { params: { username: 'j.doe' } })
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./httpClient', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
  compactParams: (params) =>
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')),
}))

import httpClient from './httpClient'
import * as trainersApi from './trainersApi'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('trainersApi', () => {
  it('registerTrainer posts the trainer fields', async () => {
    httpClient.post.mockResolvedValue({ data: { username: 'a.b', password: 'p' } })
    await trainersApi.registerTrainer({ firstName: 'Ann', lastName: 'Lee', specialization: 'Yoga' })
    expect(httpClient.post).toHaveBeenCalledWith('/trainers', {
      firstName: 'Ann',
      lastName: 'Lee',
      specialization: 'Yoga',
    })
  })

  it('getTrainerProfile GETs by username', async () => {
    httpClient.get.mockResolvedValue({ data: {} })
    await trainersApi.getTrainerProfile('a.b')
    expect(httpClient.get).toHaveBeenCalledWith('/trainers/a.b')
  })

  it('updateTrainerProfile PUTs the payload', async () => {
    httpClient.put.mockResolvedValue({ data: {} })
    const payload = { username: 'a.b', firstName: 'Ann', lastName: 'Lee', isActive: true }
    await trainersApi.updateTrainerProfile(payload)
    expect(httpClient.put).toHaveBeenCalledWith('/trainers', payload)
  })

  it('deleteTrainer DELETEs by username', async () => {
    httpClient.delete.mockResolvedValue({ data: {} })
    await trainersApi.deleteTrainer('a.b')
    expect(httpClient.delete).toHaveBeenCalledWith('/trainers/a.b')
  })

  it('getTrainerTrainees GETs the assigned trainees', async () => {
    httpClient.get.mockResolvedValue({ data: [] })
    await trainersApi.getTrainerTrainees('a.b')
    expect(httpClient.get).toHaveBeenCalledWith('/trainers/a.b/trainees')
  })

  it('searchTrainerTrainings GETs with compacted filter params', async () => {
    httpClient.get.mockResolvedValue({ data: [] })
    await trainersApi.searchTrainerTrainings({ username: 'a.b', traineeUsername: '' })
    expect(httpClient.get).toHaveBeenCalledWith('/trainers/trainings', { params: { username: 'a.b' } })
  })
})

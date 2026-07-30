import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./httpClient', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

import httpClient from './httpClient'
import * as trainingTypesApi from './trainingTypesApi'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('trainingTypesApi', () => {
  it('getTrainingTypes GETs the list', async () => {
    httpClient.get.mockResolvedValue({ data: [{ id: 1, name: 'Yoga' }] })
    const result = await trainingTypesApi.getTrainingTypes()
    expect(httpClient.get).toHaveBeenCalledWith('/training-types')
    expect(result).toEqual([{ id: 1, name: 'Yoga' }])
  })
})

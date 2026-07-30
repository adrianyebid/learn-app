import httpClient from './httpClient'

export function getTrainingTypes() {
  return httpClient.get('/training-types').then((res) => res.data)
}

import httpClient from './httpClient'

export function createTraining(payload) {
  return httpClient.post('/trainings', payload).then((res) => res.data)
}

export function deleteTraining(trainingId) {
  return httpClient.delete(`/trainings/${trainingId}`).then((res) => res.data)
}

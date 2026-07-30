import httpClient, { compactParams } from './httpClient'

export function registerTrainer({ firstName, lastName, specialization }) {
  return httpClient.post('/trainers', { firstName, lastName, specialization }).then((res) => res.data)
}

export function getTrainerProfile(username) {
  return httpClient.get(`/trainers/${username}`).then((res) => res.data)
}

export function updateTrainerProfile(payload) {
  return httpClient.put('/trainers', payload).then((res) => res.data)
}

export function deleteTrainer(username) {
  return httpClient.delete(`/trainers/${username}`).then((res) => res.data)
}

export function getTrainerTrainees(username) {
  return httpClient.get(`/trainers/${username}/trainees`).then((res) => res.data)
}

export function searchTrainerTrainings(filter) {
  return httpClient
    .get('/trainers/trainings', { params: compactParams(filter) })
    .then((res) => res.data)
}

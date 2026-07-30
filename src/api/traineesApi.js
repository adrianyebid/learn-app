import httpClient, { compactParams } from './httpClient'

export function registerTrainee({ firstName, lastName, dateOfBirth, address }) {
  return httpClient
    .post('/trainees', { firstName, lastName, dateOfBirth, address })
    .then((res) => res.data)
}

export function getTraineeProfile(username) {
  return httpClient.get(`/trainees/${username}`).then((res) => res.data)
}

export function updateTraineeProfile(payload) {
  return httpClient.put('/trainees', payload).then((res) => res.data)
}

export function deleteTrainee(username) {
  return httpClient.delete(`/trainees/${username}`).then((res) => res.data)
}

export function getUnassignedTrainers(username) {
  return httpClient.get(`/trainees/${username}/trainers/not-assigned`).then((res) => res.data)
}

export function assignTrainers({ traineeUsername, trainerUsernames }) {
  return httpClient
    .put('/trainees/trainers', { traineeUsername, trainerUsernames })
    .then((res) => res.data)
}

export function searchTraineeTrainings(filter) {
  return httpClient
    .get('/trainees/trainings', { params: compactParams(filter) })
    .then((res) => res.data)
}

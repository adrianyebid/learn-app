import httpClient from './httpClient'

export function login({ username, password }) {
  return httpClient.post('/auth/login', { username, password }).then((res) => res.data)
}

export function refresh(refreshToken) {
  return httpClient.post('/auth/refresh', { refreshToken }).then((res) => res.data)
}

export function logout(refreshToken) {
  return httpClient.post('/auth/logout', { refreshToken }).then((res) => res.data)
}

export function changePassword({ username, oldPassword, newPassword }) {
  return httpClient
    .put('/auth/change-password', { username, oldPassword, newPassword })
    .then((res) => res.data)
}

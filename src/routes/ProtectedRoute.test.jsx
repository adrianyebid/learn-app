import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { createTestStore, renderWithProviders } from '../test-utils'
import ProtectedRoute from './ProtectedRoute'

function renderGuard(store) {
  return renderWithProviders(
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/private" element={<div>Secret</div>} />
      </Route>
      <Route path="/login" element={<div>Login page</div>} />
    </Routes>,
    { route: '/private', store },
  )
}

describe('ProtectedRoute', () => {
  it('redirects to /login when there is no session', () => {
    renderGuard(createTestStore())
    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it('renders the protected content when authenticated', () => {
    const store = createTestStore({
      auth: {
        accessToken: 'at',
        refreshToken: 'rt',
        username: 'john.doe',
        role: 'ROLE_TRAINEE',
        status: 'succeeded',
        error: null,
        registration: { status: 'idle', error: null, result: null },
        changePasswordStatus: 'idle',
        changePasswordError: null,
      },
    })
    renderGuard(store)
    expect(screen.getByText('Secret')).toBeInTheDocument()
  })
})

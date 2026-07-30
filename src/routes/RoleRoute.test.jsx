import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { createTestStore, renderWithProviders } from '../test-utils'
import RoleRoute from './RoleRoute'

function authState(role) {
  return {
    auth: {
      accessToken: 'at',
      refreshToken: 'rt',
      username: 'john.doe',
      role,
      status: 'succeeded',
      error: null,
      registration: { status: 'idle', error: null, result: null },
      changePasswordStatus: 'idle',
      changePasswordError: null,
    },
  }
}

function renderGuard(store) {
  return renderWithProviders(
    <Routes>
      <Route
        path="/add-training"
        element={
          <RoleRoute roles={['ROLE_TRAINEE']}>
            <div>Add training page</div>
          </RoleRoute>
        }
      />
      <Route path="/my-account" element={<div>My account page</div>} />
    </Routes>,
    { route: '/add-training', store },
  )
}

describe('RoleRoute', () => {
  it('renders children when the role is allowed', () => {
    renderGuard(createTestStore(authState('ROLE_TRAINEE')))
    expect(screen.getByText('Add training page')).toBeInTheDocument()
  })

  it('redirects to My Account when the role is not allowed', () => {
    renderGuard(createTestStore(authState('ROLE_TRAINER')))
    expect(screen.getByText('My account page')).toBeInTheDocument()
  })
})

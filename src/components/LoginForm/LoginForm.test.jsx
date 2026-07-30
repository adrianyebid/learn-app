import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('react-google-recaptcha', () => ({
  default: ({ onChange }) => (
    <button type="button" onClick={() => onChange('test-token')}>
      Verify captcha
    </button>
  ),
}))

import LoginForm from './LoginForm'

describe('LoginForm', () => {
  it('shows validation errors and blocks submission when fields are empty', async () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }))
    expect(await screen.findByText('Username is required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('blocks submission until the captcha is confirmed', async () => {
    const onSubmit = vi.fn().mockResolvedValue()
    render(<LoginForm onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText('Username or email'), 'john.doe')
    await userEvent.type(screen.getByLabelText('Password'), 'secret123')
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }))
    expect(await screen.findByText('Please confirm you are not a robot')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits valid credentials once the captcha is confirmed', async () => {
    const onSubmit = vi.fn().mockResolvedValue()
    render(<LoginForm onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText('Username or email'), 'john.doe')
    await userEvent.type(screen.getByLabelText('Password'), 'secret123')
    await userEvent.click(screen.getByRole('button', { name: 'Verify captcha' }))
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }))
    expect(onSubmit).toHaveBeenCalledWith({ username: 'john.doe', password: 'secret123' })
  })

  it('shows the server error message when onSubmit rejects', async () => {
    const onSubmit = vi.fn().mockRejectedValue('Invalid username or password')
    render(<LoginForm onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText('Username or email'), 'john.doe')
    await userEvent.type(screen.getByLabelText('Password'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: 'Verify captcha' }))
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }))
    expect(await screen.findByText('Invalid username or password')).toBeInTheDocument()
  })
})

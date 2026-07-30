import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test-utils'

vi.mock('react-google-recaptcha', () => ({
  default: ({ onChange }) => (
    <button type="button" onClick={() => onChange('test-token')}>
      Verify captcha
    </button>
  ),
}))

vi.mock('../../api/trainingTypesApi', () => ({
  getTrainingTypes: vi.fn().mockResolvedValue([
    { id: 1, name: 'Yoga' },
    { id: 2, name: 'Cardio' },
  ]),
}))

import RegistrationForm from './RegistrationForm'

describe('RegistrationForm', () => {
  it('validates the Student fields and blocks submission when empty', async () => {
    const onSubmit = vi.fn()
    renderWithProviders(<RegistrationForm onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }))
    expect(await screen.findByText('First name is required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('switches to Trainer fields, lists specializations from the API, and requires one', async () => {
    const onSubmit = vi.fn()
    renderWithProviders(<RegistrationForm onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Trainer' }))
    expect(screen.getByText('Specialization *')).toBeInTheDocument()
    expect(screen.queryByText('Date of birth')).not.toBeInTheDocument()
    expect(await screen.findByRole('option', { name: 'Yoga' })).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('First name *'), 'Ann')
    await userEvent.type(screen.getByLabelText('Last name *'), 'Lee')
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }))
    expect(await screen.findByText('Specialization is required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits Trainer values with a specialization selected from the list', async () => {
    const onSubmit = vi.fn().mockResolvedValue()
    renderWithProviders(<RegistrationForm onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Trainer' }))
    await userEvent.type(screen.getByLabelText('First name *'), 'Ann')
    await userEvent.type(screen.getByLabelText('Last name *'), 'Lee')
    await userEvent.selectOptions(await screen.findByRole('combobox'), 'Yoga')
    await userEvent.click(screen.getByRole('button', { name: 'Verify captcha' }))
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }))
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'Trainer', firstName: 'Ann', lastName: 'Lee', specialization: 'Yoga' }),
    )
  })

  it('submits Student values once the captcha is confirmed', async () => {
    const onSubmit = vi.fn().mockResolvedValue()
    renderWithProviders(<RegistrationForm onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText('First name *'), 'John')
    await userEvent.type(screen.getByLabelText('Last name *'), 'Doe')
    await userEvent.click(screen.getByRole('button', { name: 'Verify captcha' }))
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }))
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'Student', firstName: 'John', lastName: 'Doe' }),
    )
  })

  it('shows the server error message when onSubmit rejects', async () => {
    const onSubmit = vi.fn().mockRejectedValue('Username already exists')
    renderWithProviders(<RegistrationForm onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText('First name *'), 'John')
    await userEvent.type(screen.getByLabelText('Last name *'), 'Doe')
    await userEvent.click(screen.getByRole('button', { name: 'Verify captcha' }))
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }))
    expect(await screen.findByText('Username already exists')).toBeInTheDocument()
  })
})

import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MyAccountList from './MyAccountList'

const TRAINEE_PROFILE = {
  username: 'john.doe',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '2000-01-01',
  address: 'Main St',
  isActive: true,
  trainers: [{ username: 'a.b', firstName: 'Ann', lastName: 'Lee', specialization: 'Yoga' }],
}

const TRAINER_PROFILE = {
  username: 'a.b',
  firstName: 'Ann',
  lastName: 'Lee',
  specialization: 'Yoga',
  isActive: true,
}

describe('MyAccountList', () => {
  it('renders the trainee profile plus a My Trainers section', () => {
    render(
      <MyAccountList profile={TRAINEE_PROFILE} role="ROLE_TRAINEE" onSave={vi.fn()} onDelete={vi.fn()} onAddTrainer={vi.fn()} />,
    )
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('My Trainers')).toBeInTheDocument()
    expect(screen.getByText('Ann Lee')).toBeInTheDocument()
  })

  it('hides My Trainers and shows a read-only specialization for trainers', () => {
    render(<MyAccountList profile={TRAINER_PROFILE} role="ROLE_TRAINER" onSave={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByText('My Trainers')).not.toBeInTheDocument()
    expect(screen.getByText('Specialization')).toBeInTheDocument()
    expect(screen.getByText('Yoga')).toBeInTheDocument()
  })

  it('validates required fields and calls onSave with the edited values', async () => {
    const onSave = vi.fn().mockResolvedValue()
    render(
      <MyAccountList profile={TRAINEE_PROFILE} role="ROLE_TRAINEE" onSave={onSave} onDelete={vi.fn()} onAddTrainer={vi.fn()} />,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Edit Profile' }))
    const firstNameInput = screen.getByDisplayValue('John')
    await userEvent.clear(firstNameInput)
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(await screen.findByText('First name is required')).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()

    await userEvent.type(firstNameInput, 'Jane')
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ firstName: 'Jane' }))
  })

  it('cancel restores the original values without calling onSave', async () => {
    const onSave = vi.fn()
    render(
      <MyAccountList profile={TRAINEE_PROFILE} role="ROLE_TRAINEE" onSave={onSave} onDelete={vi.fn()} onAddTrainer={vi.fn()} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Edit Profile' }))
    await userEvent.clear(screen.getByDisplayValue('John'))
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('opens the delete confirmation modal and calls onDelete on confirm', async () => {
    const onDelete = vi.fn()
    render(
      <MyAccountList profile={TRAINEE_PROFILE} role="ROLE_TRAINEE" onSave={vi.fn()} onDelete={onDelete} onAddTrainer={vi.fn()} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Delete Account' }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Delete account')).toBeInTheDocument()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete Account' }))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})

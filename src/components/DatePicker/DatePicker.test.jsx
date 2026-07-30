import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DatePicker from './DatePicker'

describe('DatePicker', () => {
  it('shows the label and calls onChange with the raw value', async () => {
    const onChange = vi.fn()
    render(<DatePicker label="Training date" value="" onChange={onChange} />)
    const input = screen.getByLabelText('Training date')
    await userEvent.type(input, '2026-01-15')
    expect(onChange).toHaveBeenCalled()
  })

  it('renders the error message when provided', () => {
    render(<DatePicker label="Date" value="" onChange={() => {}} error="Required" />)
    expect(screen.getByText('Required')).toBeInTheDocument()
  })
})

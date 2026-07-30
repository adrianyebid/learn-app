import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from './Modal'

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<Modal open={false} title="Hi" onClose={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the title and children when open, and closes on the ✕ button', async () => {
    const onClose = vi.fn()
    render(
      <Modal open title="Delete account" onClose={onClose}>
        Are you sure?
      </Modal>,
    )
    expect(screen.getByText('Delete account')).toBeInTheDocument()
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders the footer slot when provided', () => {
    render(
      <Modal open title="t" onClose={() => {}} footer={<button>Confirm</button>}>
        body
      </Modal>,
    )
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })
})

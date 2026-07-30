import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Toaster from './Toaster'

describe('Toaster', () => {
  it('renders each toast message and dismisses the right one', async () => {
    const onDismiss = vi.fn()
    render(
      <Toaster
        toasts={[
          { id: '1', type: 'success', message: 'Training added' },
          { id: '2', type: 'error', message: 'Something failed' },
        ]}
        onDismiss={onDismiss}
      />,
    )
    expect(screen.getByText('Training added')).toBeInTheDocument()
    expect(screen.getByText('Something failed')).toBeInTheDocument()

    await userEvent.click(screen.getAllByRole('button', { name: 'Dismiss' })[0])
    expect(onDismiss).toHaveBeenCalledWith('1')
  })

  it('renders nothing when there are no toasts', () => {
    render(<Toaster toasts={[]} onDismiss={() => {}} />)
    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument()
  })
})

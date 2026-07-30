import { act } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider, useToast } from './ToastContext'

function Consumer() {
  const { toasts, notify, dismiss } = useToast()
  return (
    <div>
      <button onClick={() => notify.success('Saved')}>notify</button>
      {toasts.map((toast) => (
        <div key={toast.id}>
          {toast.message}
          <button onClick={() => dismiss(toast.id)}>dismiss</button>
        </div>
      ))}
    </div>
  )
}

describe('ToastContext', () => {
  it('adds a toast on notify and removes it on dismiss', async () => {
    render(
      <ToastProvider>
        <Consumer />
      </ToastProvider>,
    )
    await userEvent.click(screen.getByText('notify'))
    expect(screen.getByText('Saved')).toBeInTheDocument()

    await userEvent.click(screen.getByText('dismiss'))
    expect(screen.queryByText('Saved')).not.toBeInTheDocument()
  })

  it('auto-dismisses a toast after 4 seconds', () => {
    vi.useFakeTimers()
    render(
      <ToastProvider>
        <Consumer />
      </ToastProvider>,
    )
    act(() => {
      screen.getByText('notify').click()
    })
    expect(screen.getByText('Saved')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(screen.queryByText('Saved')).not.toBeInTheDocument()
    vi.useRealTimers()
  })
})

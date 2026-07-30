import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useBreadcrumbs } from './useBreadcrumbs'

function wrapper(initialEntries) {
  return function Wrapper({ children }) {
    return <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  }
}

describe('useBreadcrumbs', () => {
  it('is just "Home" on the home page', () => {
    const { result } = renderHook(() => useBreadcrumbs(), { wrapper: wrapper(['/home']) })
    expect(result.current).toEqual([{ label: 'Home' }])
  })

  it('builds a cumulative trail using known route labels', () => {
    const { result } = renderHook(() => useBreadcrumbs(), { wrapper: wrapper(['/my-account/trainings']) })
    expect(result.current).toEqual([
      { label: 'Home', href: '/home' },
      { label: 'My Account', href: '/my-account' },
      { label: 'Trainings' },
    ])
  })

  it('prettifies segments that have no known label', () => {
    const { result } = renderHook(() => useBreadcrumbs(), { wrapper: wrapper(['/some-unknown-page']) })
    expect(result.current).toEqual([{ label: 'Home', href: '/home' }, { label: 'Some Unknown Page' }])
  })
})

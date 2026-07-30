import { describe, expect, it } from 'vitest'
import { getThunkErrorMessage } from './getThunkErrorMessage'

describe('getThunkErrorMessage', () => {
  it('returns a plain string error as-is', () => {
    expect(getThunkErrorMessage('Invalid credentials')).toBe('Invalid credentials')
  })

  it('reads .message off an Error-like object', () => {
    expect(getThunkErrorMessage(new Error('boom'))).toBe('boom')
  })

  it('falls back to the default when nothing usable is present', () => {
    expect(getThunkErrorMessage(undefined, 'fallback')).toBe('fallback')
  })
})

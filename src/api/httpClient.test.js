import { describe, expect, it } from 'vitest'
import { extractErrorMessage, compactParams } from './httpClient'

describe('extractErrorMessage', () => {
  it('joins validation field errors into one message', () => {
    const error = {
      response: {
        data: { errors: { username: 'Username is required', password: 'Password is required' } },
      },
    }
    expect(extractErrorMessage(error)).toBe('Username is required Password is required')
  })

  it('falls back to the response message when there are no field errors', () => {
    const error = { response: { data: { message: 'Invalid credentials' } } }
    expect(extractErrorMessage(error)).toBe('Invalid credentials')
  })

  it('falls back to the provided default when nothing is available', () => {
    expect(extractErrorMessage({}, 'Oops')).toBe('Oops')
  })

  it('uses the network error message when there is no response at all', () => {
    expect(extractErrorMessage({ message: 'Network Error' })).toBe('Network Error')
  })
})

describe('compactParams', () => {
  it('drops undefined, null and empty-string values', () => {
    expect(compactParams({ a: 1, b: undefined, c: null, d: '', e: 'x' })).toEqual({ a: 1, e: 'x' })
  })

  it('keeps falsy-but-meaningful values like 0 and false', () => {
    expect(compactParams({ a: 0, b: false })).toEqual({ a: 0, b: false })
  })
})

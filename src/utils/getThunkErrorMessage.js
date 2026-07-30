/**
 * RTK's `.unwrap()` throws the raw `rejectWithValue(...)` payload (a plain
 * string, in every thunk in this app) rather than an Error instance, so
 * `error.message` alone isn't reliable in a catch block — this normalizes
 * both shapes into a displayable string.
 */
export function getThunkErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (typeof error === 'string') return error
  return error?.message ?? fallback
}

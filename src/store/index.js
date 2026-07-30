import { configureStore } from '@reduxjs/toolkit'
import { AUTH_EXPIRED_EVENT } from '../api/httpClient'
import authReducer, { sessionExpired } from './authSlice'
import traineeReducer from './traineeSlice'
import trainerReducer from './trainerSlice'
import trainingsReducer from './trainingsSlice'
import trainingTypesReducer from './trainingTypesSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    trainee: traineeReducer,
    trainer: trainerReducer,
    trainings: trainingsReducer,
    trainingTypes: trainingTypesReducer,
  },
})

// httpClient can't dispatch directly (it would create a circular import with
// the store), so it signals an expired session via this DOM event instead.
window.addEventListener(AUTH_EXPIRED_EVENT, () => store.dispatch(sessionExpired()))

export default store

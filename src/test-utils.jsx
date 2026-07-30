import { configureStore } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import authReducer from './store/authSlice'
import traineeReducer from './store/traineeSlice'
import trainerReducer from './store/trainerSlice'
import trainingsReducer from './store/trainingsSlice'
import trainingTypesReducer from './store/trainingTypesSlice'

export function createTestStore(preloadedState) {
  return configureStore({
    reducer: {
      auth: authReducer,
      trainee: traineeReducer,
      trainer: trainerReducer,
      trainings: trainingsReducer,
      trainingTypes: trainingTypesReducer,
    },
    preloadedState,
  })
}

/** Renders a component wrapped with the same providers the real app mounts under. */
export function renderWithProviders(ui, { route = '/', store = createTestStore(), ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    )
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export * from '@testing-library/react'

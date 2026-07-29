import { Navigate, Route, Routes } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import { PATHS, ROUTES } from './routes/paths'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Training from './pages/Training/Training'
import JoinUs from './pages/JoinUs/JoinUs'
import Registration from './pages/Registration/Registration'
import RegistrationVerification from './pages/RegistrationVerification/RegistrationVerification'
import MyAccount from './pages/MyAccount/MyAccount'
import ChangePassword from './pages/ChangePassword/ChangePassword'
import NotFound from './pages/NotFound/NotFound'

// Element for each protected path. Which paths are protected is decided in a
// single place — the `protected: true` flag on ROUTES in routes/paths.js —
// so this map only has to answer "what does it render", never "is it guarded".
const PROTECTED_ELEMENTS = {
  [PATHS.myAccount]: <MyAccount />,
  [PATHS.changePassword]: <ChangePassword />,
}

const protectedRoutes = ROUTES.filter((route) => route.protected)

/**
 * Application router. Every view is nested under the shared RootLayout so the
 * header, footer and breadcrumbs persist across navigation. Private views sit
 * behind the ProtectedRoute guard, unknown URLs fall through to the 404 page,
 * and the index redirects to the default "home" route.
 */
function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Navigate to={PATHS.home} replace />} />

        {/* Public routes */}
        <Route path={PATHS.home} element={<Home />} />
        <Route path={PATHS.login} element={<Login />} />
        <Route path={PATHS.training} element={<Training />} />
        <Route path={PATHS.joinUs} element={<JoinUs />} />
        <Route path={PATHS.registration} element={<Registration />} />
        <Route
          path={PATHS.registrationVerification}
          element={<RegistrationVerification />}
        />

        {/* Protected routes (require authentication) — derived from ROUTES */}
        <Route element={<ProtectedRoute />}>
          {protectedRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={PROTECTED_ELEMENTS[route.path]}
            />
          ))}
        </Route>

        {/* Fallback: 404 Page Not Found */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App

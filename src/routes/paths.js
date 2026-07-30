/**
 * Single source of truth for the application's routes.
 *
 * PATHS holds the URL of every view so components never hard-code strings
 * (DRY). ROUTES is the ordered metadata list the router, the main navigation
 * menu and the breadcrumbs are all derived from — add a view here once and it
 * is wired everywhere.
 */
export const PATHS = {
  home: '/home',
  login: '/login',
  myAccount: '/my-account',
  training: '/training',
  joinUs: '/join-us',
  changePassword: '/change-password',
  registration: '/registration',
  registrationVerification: '/registration-verification',
  myTrainings: '/my-account/trainings',
  addTraining: '/my-account/trainings/add',
  addTrainer: '/my-account/add-trainer',
}

/**
 * Route metadata.
 *  - label:     human-readable name (used by nav links and breadcrumbs)
 *  - showInNav: whether it appears in the primary navigation menu
 *  - protected: whether it is behind the authentication guard
 */
export const ROUTES = [
  { path: PATHS.home, label: 'Home', showInNav: true },
  { path: PATHS.training, label: 'Training', showInNav: true },
  { path: PATHS.joinUs, label: 'Join Us' },
  { path: PATHS.myAccount, label: 'My Account', showInNav: true, protected: true },
  { path: PATHS.login, label: 'Login' },
  { path: PATHS.registration, label: 'Registration' },
  { path: PATHS.registrationVerification, label: 'Registration Verification' },
  { path: PATHS.changePassword, label: 'Change Password', protected: true },
  { path: PATHS.myTrainings, label: 'Trainings', protected: true },
  { path: PATHS.addTraining, label: 'Add Training', protected: true, roles: ['ROLE_TRAINEE'] },
  { path: PATHS.addTrainer, label: 'Add Trainer', protected: true, roles: ['ROLE_TRAINEE'] },
]

/** Lookup of "/path" -> "Label", used to resolve breadcrumb labels. */
export const LABEL_BY_PATH = Object.fromEntries(
  ROUTES.map((route) => [route.path, route.label]),
)

/** Items shown in the primary navigation menu. */
export const NAV_ITEMS = ROUTES.filter((route) => route.showInNav)

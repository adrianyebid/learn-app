import * as Yup from 'yup'

// Mirrors the backend's (mostly presence-only) @NotBlank/@NotNull rules,
// plus a few sane UX extras the API itself doesn't enforce.

export const loginSchema = Yup.object({
  username: Yup.string().trim().required('Username is required'),
  password: Yup.string().required('Password is required'),
})

const nameFields = {
  firstName: Yup.string().trim().required('First name is required'),
  lastName: Yup.string().trim().required('Last name is required'),
}

export const registerTraineeSchema = Yup.object({
  ...nameFields,
  dateOfBirth: Yup.date().max(new Date(), 'Date of birth cannot be in the future').nullable(),
  address: Yup.string().trim(),
})

export const registerTrainerSchema = Yup.object({
  ...nameFields,
  specialization: Yup.string().trim().required('Specialization is required'),
})

// The registration form toggles between the trainee/trainer field sets, so
// validation has to react to the currently selected `role` field.
export const registrationSchema = Yup.lazy((values) =>
  values.role === 'Trainer' ? registerTrainerSchema : registerTraineeSchema,
)

export const changePasswordSchema = Yup.object({
  oldPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'New password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
    .required('Please confirm the new password'),
})

export const updateTraineeSchema = Yup.object({
  ...nameFields,
  dateOfBirth: Yup.date().max(new Date(), 'Date of birth cannot be in the future').nullable(),
  address: Yup.string().trim(),
  isActive: Yup.boolean().required(),
})

export const updateTrainerSchema = Yup.object({
  ...nameFields,
  isActive: Yup.boolean().required(),
})

export const addTrainingSchema = Yup.object({
  trainingName: Yup.string().trim().required('Training name is required'),
  trainingDate: Yup.date().required('Training date is required'),
  trainerUsername: Yup.string().required('Trainer is required'),
  trainingDuration: Yup.number()
    .typeError('Duration must be a number')
    .positive('Duration must be greater than 0')
    .integer('Duration must be a whole number')
    .required('Duration is required'),
})

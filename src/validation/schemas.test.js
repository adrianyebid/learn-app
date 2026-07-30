import { describe, expect, it } from 'vitest'
import {
  addTrainingSchema,
  changePasswordSchema,
  loginSchema,
  registerTraineeSchema,
  registerTrainerSchema,
  registrationSchema,
} from './schemas'

describe('loginSchema', () => {
  it('rejects empty fields', async () => {
    await expect(loginSchema.validate({ username: '', password: '' })).rejects.toThrow()
  })

  it('passes with both fields filled', async () => {
    await expect(loginSchema.validate({ username: 'john', password: 'secret' })).resolves.toBeTruthy()
  })
})

describe('registerTraineeSchema', () => {
  it('does not require dateOfBirth/address', async () => {
    await expect(registerTraineeSchema.validate({ firstName: 'John', lastName: 'Doe' })).resolves.toBeTruthy()
  })

  it('rejects a future date of birth', async () => {
    const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString()
    await expect(
      registerTraineeSchema.validate({ firstName: 'John', lastName: 'Doe', dateOfBirth: future }),
    ).rejects.toThrow()
  })
})

describe('registerTrainerSchema / registrationSchema', () => {
  it('requires specialization for trainers', async () => {
    await expect(registerTrainerSchema.validate({ firstName: 'A', lastName: 'B' })).rejects.toThrow()
  })

  it('registrationSchema switches its rules based on the role field', async () => {
    await expect(registrationSchema.validate({ role: 'Trainer', firstName: 'A', lastName: 'B' })).rejects.toThrow()
    await expect(
      registrationSchema.validate({ role: 'Trainer', firstName: 'A', lastName: 'B', specialization: 'Yoga' }),
    ).resolves.toBeTruthy()
    await expect(registrationSchema.validate({ role: 'Student', firstName: 'A', lastName: 'B' })).resolves.toBeTruthy()
  })
})

describe('changePasswordSchema', () => {
  it('rejects a mismatched confirmation', async () => {
    await expect(
      changePasswordSchema.validate({ oldPassword: 'a', newPassword: 'newpass1', confirmPassword: 'different' }),
    ).rejects.toThrow()
  })

  it('accepts a matching confirmation of sufficient length', async () => {
    await expect(
      changePasswordSchema.validate({ oldPassword: 'a', newPassword: 'newpass1', confirmPassword: 'newpass1' }),
    ).resolves.toBeTruthy()
  })
})

describe('addTrainingSchema', () => {
  it('rejects a non-positive duration', async () => {
    await expect(
      addTrainingSchema.validate({
        trainingName: 'Yoga',
        trainingDate: '2026-01-01',
        trainerUsername: 'jane',
        trainingDuration: -5,
      }),
    ).rejects.toThrow()
  })

  it('passes with valid values', async () => {
    await expect(
      addTrainingSchema.validate({
        trainingName: 'Yoga',
        trainingDate: '2026-01-01',
        trainerUsername: 'jane',
        trainingDuration: 60,
      }),
    ).resolves.toBeTruthy()
  })
})

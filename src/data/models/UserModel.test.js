import mongoose from 'mongoose'
import UserModel from './UserModel'
import { passwordValidator, emailValidator, nameValidator } from '../validators'
import { validEmails, invalidEmails } from '../../../test/constants'
import { repeat } from '../../../test/helpers'
import PasswordHash from '../../utils/PasswordHash'
import { logger } from '../../server/logger'

const testUser = {
  email: 'test@gmail.com',
  password: 'abc123!@#$%^&*()_+-={}|:"<>?,./;\'[]\\~`',
  name: {
    first: 'John',
    last: 'Doe',
  },
}

beforeAll(async () => UserModel.collection.drop())

afterAll(done => {
  mongoose.connection.close()
  done()
})

describe('User model', () => {
  test('saving user', async () => {
    const user = UserModel(testUser)
    expect(user.isNew).toBe(true)
    try {
      await user.save()
      expect(user.isNew).toBe(false)
    } catch (error) {
      expect(error).toBeUndefined()
    }
  })

  test('disallows invalid user from being saved', async () => {
    const user = new UserModel({})
    try {
      await user.save()
    } catch (validationResult) {
      expect(validationResult.errors['name.first'].message).toBe(
        nameValidator.first.required[1],
      )
      expect(validationResult.errors['name.last'].message).toBe(
        nameValidator.last.required[1],
      )
      expect(validationResult.errors.email.message).toBe(
        emailValidator.required[1],
      )
      expect(validationResult.errors.password.message).toBe(
        passwordValidator.required[1],
      )
    }
  })

  test('email is valid', async () => {
    invalidEmails.forEach(email => {
      const user = UserModel({
        ...testUser,
        email,
      })
      const validationResult = user.validateSync()
      if (!validationResult) {
        logger.log(email)
      }
      expect(validationResult.errors.email.message).toBe(
        emailValidator.validate.message,
      )
    })

    validEmails.forEach(email => {
      const user = UserModel({
        ...testUser,
        email,
      })
      const validationResult = user.validateSync()
      if (validationResult) {
        logger.info(email)
      }
      expect(validationResult).toBeFalsy(validationResult)
    })
  })

  test('email is unique', async () => {
    const user = UserModel(testUser)
    try {
      await user.save()
    } catch (error) {
      expect(error.code).toBe(11000)
    }
  })

  test('password is at least 8 characters', async () => {
    let validationResult = UserModel({
      ...testUser,
      password: 'abc123',
    }).validateSync()
    expect(validationResult.errors.password.message).toBe(
      passwordValidator.minlength[1],
    )

    validationResult = UserModel({
      ...testUser,
      password: 'abcd1234',
    }).validateSync()
    expect(validationResult).toBeUndefined()
  })

  test('passwords requires at least one letter and one password', () => {
    const validPasswords = [
      'abcd1234',
      'ABCD1234',
      'Abcd1234',
      'Abcd123!',
      '1234abcd',
      '1234ABCD',
      '1234Abcd',
      '!Abcd123',
      'a1!@#$%^&*()_+-={}|:"<>?,./;\'[]\\~`',
      `1${repeat('a', 49)}`,
    ]

    validPasswords.forEach(password => {
      const user = UserModel({
        ...testUser,
        password,
      })
      const validationResult = user.validateSync()
      if (validationResult) {
        logger.info(password)
      }
      expect(validationResult).toBeUndefined()
    })

    const invalidPasswords = [
      'abcdefgh',
      'ABCDEFGH',
      'abcdefg!',
      '!abcdefg',
      '12345678',
      '1234567!',
      '!1234567',
      'a!@#$%^&*()_+-={}|:"<>?,./;\'[]\\~`',
      `${repeat('a', 50)}`,
      `${repeat('1', 50)}`,
    ]

    invalidPasswords.forEach(password => {
      const user = UserModel({
        ...testUser,
        password,
      })
      const validationResult = user.validateSync()
      if (!validationResult) {
        logger.info(password)
      }
      expect(validationResult).toHaveProperty(
        'errors.password.message',
        passwordValidator.match[1],
      )
    })
  })

  test('hashed password is saved', async () => {
    const user = UserModel({
      ...testUser,
      email: 'john.doe@gmail.com',
    })
    expect(user.isNew).toBe(true)
    try {
      const { password } = await user.save()
      const compare = await PasswordHash.compare(testUser.password, password)
      expect(compare).toBe(true)
    } catch (error) {
      expect(error).toBeUndefined()
    }
  })

  test('createdAt and updatedAt date is set when saving user', async () => {
    const user = UserModel({
      ...testUser,
      email: 'john.doe2@gmail.com',
    })
    expect(user.isNew).toBe(true)
    try {
      const { createdAt, updatedAt } = await user.save()
      expect(createdAt instanceof Date).toBe(true)
      expect(updatedAt instanceof Date).toBe(true)
    } catch (error) {
      expect(error).toBeUndefined()
    }
  })

  // test('updateAt date is updated with update operation', async () => {
  //   try {
  //     const { createdAt, updatedAt } = await UserModel.findOne({
  //       email: testUser.email,
  //     })
  //     expect(createdAt instanceof Date).toBe(true)
  //     expect(updatedAt instanceof Date).toBe(true)
  //     const opts = { new: true, runValidators: true }
  //     const updated = await UserModel.update(
  //       { 'name.first': testUser.name.first },
  //       { $set: { 'name.last': 'Doe' } },
  //       opts,
  //     )
  //     logger.info(updated)
  //     // expect(newUpdatedAt instanceof Date).toBe(true)
  //     // expect(last).not.toBe(testUser.name.last)
  //     // expect(updatedAt.toUTCString()).not.toBe(newUpdatedAt.toUTCString())
  //   } catch (error) {
  //     expect(error).toBeUndefined()
  //   }
  // })

  test('updateAt date is updated with findOneAndUpdate operation', async () => {
    try {
      const { createdAt, updatedAt } = await UserModel.findOne({
        email: testUser.email,
      })
      expect(createdAt instanceof Date).toBe(true)
      expect(updatedAt instanceof Date).toBe(true)
      const opts = { new: true, runValidators: true }
      const {
        name: { first },
        updatedAt: newUpdatedAt,
      } = await UserModel.findOneAndUpdate(
        { email: testUser.email },
        { $set: { 'name.first': 'James' } },
        opts,
      )
      expect(newUpdatedAt instanceof Date).toBe(true)
      expect(first).not.toBe(testUser.name.first)
      expect(updatedAt.toUTCString()).not.toBe(newUpdatedAt.toUTCString())
    } catch (error) {
      expect(error).toBeUndefined()
    }
  })
})

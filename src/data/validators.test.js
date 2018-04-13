import { emailValidator, PASSWORD_REGEX } from './validators'
import { validEmails, invalidEmails } from '../../test/constants'

describe('validators', () => {
  test('valid emails', async () => {
    validEmails.forEach(email => {
      expect(emailValidator.validate.validator(email)).toBe(true)
    })
  })

  test('invalid emails', async () => {
    invalidEmails.forEach(email => {
      expect(emailValidator.validate.validator(email)).toBe(false)
    })
  })

  test('password PASSWORD_REGEX', async () => {
    const validPassword = [
      '1a',
      'a1',
      '1A',
      'A1',
      '!a1',
      '1a!',
      '3aBc3',
      'a123A',
      '2010.11.02a',
      'Ofar-E*Qnmcm_eSPA123',
    ]
    validPassword.forEach(email => {
      expect(email).toMatch(PASSWORD_REGEX)
    })

    const invalidPassword = [
      '1',
      'a',
      'abc',
      'ABC',
      '123',
      '!abc',
      '!ABC',
      '!123',
      'abc!',
      'ABC!',
      '123!',
      '!abc!',
      '!ABC!',
      '!123!',
      'Ofar-E*Qnmcm_eSPA',
      '2010.11.02',
      'mississDOGippi',
    ]
    invalidPassword.forEach(email => {
      expect(email).not.toMatch(PASSWORD_REGEX)
    })
  })
})

import isEmail from 'validator/lib/isEmail'

const DEFAULT_MAX_LENGTH = 50

export const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-zA-Z])(.+)$/

export const nameValidator = {
  first: {
    type: String,
    required: [true, 'Please provide your first name.'],
    maxlength: [
      DEFAULT_MAX_LENGTH,
      `First name is too long (maximum is ${DEFAULT_MAX_LENGTH} characters)`,
    ],
  },
  last: {
    type: String,
    required: [true, 'Please provide your last name.'],
    maxlength: [
      DEFAULT_MAX_LENGTH,
      `Last name is too long (maximum is ${DEFAULT_MAX_LENGTH} characters)`,
    ],
  },
}

export const emailValidator = {
  type: String,
  unique: true,
  required: [true, 'Please provide a valid email.'],
  validate: {
    validator(email) {
      return isEmail(email, {
        allow_display_name: false,
        require_display_name: false,
        allow_utf8_local_part: true,
        require_tld: true,
      })
    },
    message: 'Please enter your email address.',
  },
}

export const passwordValidator = {
  type: String,
  required: [true, 'Please enter a password.'],
  minlength: [8, 'Password is too short (minimum is 8 characters)'],
  maxlength: [
    DEFAULT_MAX_LENGTH,
    `Password is too long (maximum is ${DEFAULT_MAX_LENGTH} characters)`,
  ],
  match: [
    PASSWORD_REGEX,
    'Password requires at least one letter and one number',
  ],
}

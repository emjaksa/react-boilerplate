const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  bail: process.env.NODE_ENV === 'production',
  verbose: true,
  roots: ['<rootDir>/src/'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/__mocks__/fileMock.js',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  setupFiles: ['<rootDir>/test/setup.js'],
  watchPathIgnorePatterns: ['/__generated__/'],
}

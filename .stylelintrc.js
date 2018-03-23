module.exports = {
  extends: 'stylelint-config-standard',
  plugins: ['stylelint-no-unsupported-browser-features'],
  rules: {
    'color-hex-case': 'upper',
    'color-hex-length': 'long',
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'mixin',
          'include',
          'function',
          'return',
          'extends',
          'at-root',
          'debug',
          'warn',
          'error',
        ],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
  },
}

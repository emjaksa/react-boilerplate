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
          "if",
          "for",
          "mixin",
          "include",
          "function",
          "return",
          "extends",
          "extend",
          "at-root",
          "debug",
          "warn",
          "error",
          "util"
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

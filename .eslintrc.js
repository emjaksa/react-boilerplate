module.exports = {
  parser: "babel-eslint",
  extends: [
    "airbnb",
    "prettier",
    "prettier/react",
    "plugin:css-modules/recommended"
  ],
  plugins: ["compat", "css-modules", "prettier"],
  globals: {
    test: true,
    browser: true,
  },
  rules: {
    // We automatically convert pure class to function in release mode by
    // babel-plugin-transform-react-pure-class-to-function
    "react/prefer-stateless-function": "off",
    // Allow .js files to use JSX syntax
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    // ESLint plugin for prettier formatting
    // https://github.com/prettier/eslint-plugin-prettier
    'prettier/prettier': 'error',
  }
};

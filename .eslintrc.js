module.exports = {
  root: true,
  env: {
    node: true
  },
  "globals": {
    "ymaps": true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': [1, { 'vars': 'all', 'args': 'after-used', 'ignoreRestSiblings': false }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}

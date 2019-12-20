module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-trailing-spaces':0,
    'space-before-function-paren': 0,
    'object-curly-spacing': 0,
    'space-infix-ops': 0,
    'padded-blocks': 0,
    'keyword-spacing': 0,
    'no-multiple-empty-lines': 0,
    'no-unused-expressions': 0,
    'key-spacing': 0,
    'space-before-blocks': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}

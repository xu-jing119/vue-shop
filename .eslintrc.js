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
    'space-before-blocks': 0,
    'comma-spacing': 0,
    'arrow-spacing': 0,
    'indent': 0,
    'no-unused-vars': 0,
    'vue/no-unused-vars': 0,
    'vue/valid-v-for': 0,
    'comma-dangle': 0,
    'object-property-newline': 0,
    'vue/no-parsing-error': 0,
    'no-multi-spaces': 0,
    'no-useless-return': 0,
    'eqeqeq': 0,
    'semi':0,
    'no-undef':0,
    'quotes':0,
    'space-in-parens':0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}

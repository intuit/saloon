module.exports = {
  rules: {
    'no-underscore-dangle': [0],
    'linebreak-style': 0,
    'no-shadow':[0],
    'max-len':[0]
  },
  env: {
    es6: true,
    browser: false,
    node: true,
    commonjs: true,
  },
  globals: {
    __DEBUG__: false,
  },
  extends: 'airbnb-base',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      spread: true,
    },
  },
};
export default {
  input: './index.js',
  output: {
    file: './es6/common/index.js',
    format: 'cjs',
    interop: false
  },
  external: [
    'raven-js'
  ]
};

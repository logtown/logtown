export default {
  entry: './index.js',
  dest: './es6/common/index.js',
  format: 'cjs',
  external: [
    'lodash',
    'ember-empty-object'
  ],
  interop: false
};

'use strict';

module.exports = [{
  input: './index.js',
  output: {
    file: './es6/common/index.js',
    format: 'cjs',
    interop: false
  },
  external: [
    'dlv',
    'dset',
    'deepmerge'
  ]
}, {
  input: './plugins/stacktrace.js',
  output: {
    file: './es6/common/plugins/stacktrace.js',
    format: 'cjs',
    interop: false
  },
  external: []
}];

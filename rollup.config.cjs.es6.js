'use strict';

module.exports = [{
  input: './index.js',
  output: {
    file: './es6/common/index.js',
    format: 'cjs',
    interop: false,
  },
  external: [
    'ember-empty-object',
    'lodash.get',
    'lodash.merge',
    'lodash.set',
    'lodash.omit',
  ],
}, {
  input: './plugins/stacktrace.js',
  output: {
    file: './es6/common/plugins/stacktrace.js',
    format: 'cjs',
    interop: false,
  },
  external: [],
}];

'use strict';

export default [{
  entry: './index.js',
  dest: './es6/common/index.js',
  format: 'cjs',
  external: [
    'ember-empty-object',
    'lodash.get',
    'lodash.merge',
    'lodash.set',
    'lodash.omit'
  ],
  interop: false,
}, {
  entry: './plugins/stacktrace.js',
  dest: './es6/common/plugins/stacktrace.js',
  format: 'cjs',
  external: [],
  interop: false,
}];

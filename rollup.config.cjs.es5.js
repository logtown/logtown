'use strict';

const babel = require('rollup-plugin-babel');

module.exports = [{
  input: './index.js',
  output: {
    file: './es5/common/index.js',
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
  plugins: [
    babel({
      presets: [
        ['es2015', { modules: false }],
      ],
    }),
  ],
}, {
  input: './plugins/stacktrace.js',
  output: {
    file: './es5/common/plugins/stacktrace.js',
    format: 'cjs',
    interop: false,
  },
  plugins: [
    babel({
      presets: [
        ['es2015', { modules: false }],
      ],
    }),
  ],
}];

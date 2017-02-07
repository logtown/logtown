'use strict';

import babel from 'rollup-plugin-babel';

export default [{
  entry: './index.js',
  dest: './es5/common/index.js',
  format: 'cjs',
  external: [
    'ember-empty-object',
    'lodash.get',
    'lodash.merge',
    'lodash.set',
    'lodash.omit'
  ],
  interop: false,
  plugins: [
    babel({
      presets: [
        ['es2015', { modules: false }]
      ]
    })
  ]
}, {
  entry: './plugins/stacktrace.js',
  dest: './es5/common/plugins/stacktrace.js',
  format: 'cjs',
  // external: [],
  interop: false,
  plugins: [
    babel({
      presets: [
        ['es2015', { modules: false }]
      ]
    })
  ]
}];

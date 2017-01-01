'use strict';

import babel from 'rollup-plugin-babel';

export default {
  entry: './index.js',
  dest: './es5/common/index.js',
  format: 'cjs',
  external: [
    'lodash',
    'ember-empty-object'
  ],
  interop: false,
  plugins: [
    babel({
      presets: [
        ['es2015', { modules: false }]
      ]
    })
  ]
};

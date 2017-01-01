'use strict';

import babel from 'rollup-plugin-babel';

export default {
  entry: './index.js',
  dest: './es5/umd/index.js',
  format: 'umd',
  external: [
    'lodash',
    'ember-empty-object'
  ],
  interop: false,
  moduleName: 'logtown',
  plugins: [
    babel({
      presets: [
        ['es2015', { modules: false }]
      ],
      plugins: [
        'external-helpers'
      ]
    })
  ]
};

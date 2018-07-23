'use strict';

import babel from 'rollup-plugin-babel';

export default {
  entry: './index.js',
  dest: './es5/umd/index.js',
  format: 'umd',
  external: [
    'raven-js'
  ],
  interop: false,
  moduleName: 'logtown-sentry-browser',
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

'use strict';

import babel from 'rollup-plugin-babel';

export default {
  entry: './index.js',
  dest: './es5/index.js',
  format: 'cjs',
  external: [
    'winston',
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

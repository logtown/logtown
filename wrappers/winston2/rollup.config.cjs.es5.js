'use strict';

const babel = require('rollup-plugin-babel');

export default {
  input: './index.js',
  output: {
    file: './es5/index.js',
    format: 'cjs',
    interop: false
  },
  external: [
    'winston'
  ],
  plugins: [
    babel({
      presets: [
        ['@babel/preset-env', {
          'targets': {
            'node': '6'
          },
          'modules': false
        }]
      ]
    })
  ]
};

'use strict';

const babel = require('rollup-plugin-babel');

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
  ],
  plugins: [
    babel({
      presets: [
        ["@babel/preset-env", {
          "targets": {
            "node": "6"
          },
        }],
      ],
    }),
  ],
}, {
  input: './plugins/stacktrace.js',
  output: {
    file: './es6/common/plugins/stacktrace.js',
    format: 'cjs',
    interop: false
  },
  external: []
}];

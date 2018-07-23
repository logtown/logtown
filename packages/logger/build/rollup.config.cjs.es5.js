'use strict';

const babel = require('rollup-plugin-babel');

module.exports = [{
  input: './index.js',
  output: {
    file: './es5/common/index.js',
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
            "browsers": ["last 2 versions", "safari >= 7"]
          },
          "modules": false
        }],
      ]
    })
  ]
}, {
  input: './plugins/stacktrace.js',
  output: {
    file: './es5/common/plugins/stacktrace.js',
    format: 'cjs',
    interop: false
  },
  plugins: [
    babel({
      presets: [
        ["@babel/preset-env", {
          "targets": {
            "browsers": ["last 2 versions", "safari >= 7"]
          },
          "modules": false
        }],
      ]
    })
  ]
}];

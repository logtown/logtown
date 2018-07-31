'use strict';

const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

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
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
    }),
    commonjs(),
    babel({
      presets: [
        ["@babel/preset-env", {
          "targets": {
            "node": "6"
          },
        }],
      ],
      plugins: [
        '@babel/plugin-external-helpers',
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

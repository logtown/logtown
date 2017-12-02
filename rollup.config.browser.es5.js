'use strict';

const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

module.exports = [{
  input: './index.js',
  external: [],
  name: 'logtown',
  output: {
    file: './es5/umd/index.js',
    format: 'umd',
    interop: false,
  },
  plugins: [
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
    }),
    commonjs(),
    babel({
      presets: [
        ['es2015', { modules: false }],
      ],
      plugins: [
        'external-helpers',
      ],
    }),
  ],
}, {
  input: './plugins/stacktrace.js',
  name: 'logtown',
  output: {
    file: './es5/umd/plugins/stacktrace.js',
    format: 'umd',
    interop: false,
  },
  plugins: [
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
    }),
    commonjs(),
    babel({
      presets: [
        ['es2015', { modules: false }],
      ],
      plugins: [
        'external-helpers',
      ],
    }),
  ],
}];

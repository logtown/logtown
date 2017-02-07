'use strict';

import babel from 'rollup-plugin-babel';
const nodeResolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");

export default [{
  entry: './index.js',
  dest: './es5/umd/index.js',
  format: 'umd',
  external: [],
  interop: false,
  moduleName: 'logtown',
  plugins: [
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
    }),
    commonjs(),
    babel({
      presets: [
        ['es2015', { modules: false }]
      ],
      plugins: [
        'external-helpers'
      ]
    })
  ]
}, {
  entry: './plugins/stacktrace.js',
  dest: './es5/umd/plugins/stacktrace.js',
  format: 'umd',
  // external: [],
  interop: false,
  moduleName: 'logtown',
  plugins: [
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
    }),
    commonjs(),
    babel({
      presets: [
        ['es2015', { modules: false }]
      ],
      plugins: [
        'external-helpers'
      ]
    })
  ]
}];

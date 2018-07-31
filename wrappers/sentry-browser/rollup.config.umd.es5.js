'use strict';

const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
  input: './index.js',
  output: {
    file: './es5/umd/index.js',
    format: 'umd',
    interop: false,
  },
  external: [
    'raven-js'
  ],
  name: 'logtown-sentry-browser',
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
            "browsers": ["last 2 versions", "safari >= 7"]
          },
          "modules": false
        }],
      ],
      plugins: [
        '@babel/plugin-external-helpers',
      ],
    }),
  ]
};

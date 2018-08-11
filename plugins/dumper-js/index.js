'use strict';

const Dumper = require('dumper.js/src/dumper');

module.exports = () => {
  return (ctx) => {
    const dumper = new Dumper();

    ctx.args = ctx.args.map((arg) => {
      if (arg instanceof Error) {
        return arg;
      }
      return dumper.generateDump(arg);
    })
  }
};

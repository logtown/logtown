'use strict';

const PrettyError = require('pretty-error');
const emptyFn = () => {
};

module.exports = ({ instance, configureCb = emptyFn } = {}) => {
  return (ctx) => {
    const pe = instance ? instance : new PrettyError();
    configureCb(pe);

    ctx.args = ctx.args.map((arg) => {
      if (arg instanceof Error) {
        return pe.render(arg);
      }
      return arg;
    })
  }
};

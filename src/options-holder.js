'use strict';

const _ = require('lodash');

const options = new WeakMap();

class OptionsHolder {
  constructor(options = {}) {
    options.set(this, options);
  }

  setOption(option, value) {
    let obj = options.get(this);
    _.set(obj, option, value);
    options.set(this, option);

    return this;
  }

  getOption(option, defaultValue) {
    return _.get(options.get(this), option, defaultValue);
  }
}

module.exports = OptionsHolder;

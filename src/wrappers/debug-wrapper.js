'use strict';

const debug = require('debug');

class DebugWrapper {
  debug(id, stats, ...rest) {
    debug(id)(...rest);
  }
}

module.exports = DebugWrapper;

'use strict';

const Logger = require('logdna');
const util = require('util');

// silly, debug, info, warn, error
//        debug, info, warn, error, fatal, trace, custom

module.exports = class Logdna {
  constructor(apikey, options = {}) {
    this.logger = Logger.createLogger(apikey, {
      index_meta: true,
      env: process.env.NODE_ENV,
      ...options
    });
  }

  static logOptions = {
    passInitialArguments: true
  };

  log(id, level, stats, ...rest) {
    let meta = {};
    const error = rest.find((v) => v instanceof Error);
    if (error) {
      meta.context = {
        error: error.stack || error.toString()
      };
    }
    const message = util.format(...rest.filter((v) => !(v instanceof Error)));
    this.logger.log(message, {
      app: id,
      level,
      meta
    });
  }

  fatal(id, stats, ...rest) {
    this.log(id, 'FATAL', stats, ...rest);
  }

  trace(id, stats, ...rest) {
    this.log(id, 'TRACE', stats, ...rest);
  }
};

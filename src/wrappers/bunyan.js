'use strict';

const bunyan = require('bunyan');

class BunyanWrapper {
  constructor(name, opts = {level: 'trace', stream: null, streams: [], serializers: null, src: false}, values = {}) {
    this._logger = bunyan.createLogger({
      name: name,
      ...opts,
      ...values
    });
  }

  silly(id, stats, ...rest) {
    this._logger.trace(...rest);
  }

  debug(id, stats, ...rest) {
    this._logger.debug(...rest);
  }

  info(id, stats, ...rest) {
    this._logger.info(...rest);
  }

  warn(id, stats, ...rest) {
    this._logger.warn(...rest);
  }

  error(id, stats, ...rest) {
    this._logger.error(...rest);
  }

}

exports.BunyanWrapper = BunyanWrapper;

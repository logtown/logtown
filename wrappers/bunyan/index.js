'use strict';

const bunyan = require('bunyan');

/**
 * Logtown wrapper for bunyan logger
 */
class Bunyan {
  /**
   * @param {string} name
   * @param {{}} opts
   * @param {{}} values
   */
  constructor(name, { level = 'trace', stream = process.stdout, streams = [], serializers = null, src = false } = {}, values = {}) {
    const options = {
      name,
      level,
      stream,
      streams,
      serializers,
      src,
      ...values
    };
    if (streams.length) {
      delete options.stream;
    } else {
      delete options.streams;
    }
    this._logger = bunyan.createLogger(options);
  }

  /**
   * @param {string} id
   * @param {{}} stats
   * @param {[]} rest
   */
  silly(id, stats, ...rest) {
    this._logger.trace(...rest);
  }

  /**
   * @param {string} id
   * @param {{}} stats
   * @param {[]} rest
   */
  debug(id, stats, ...rest) {
    this._logger.debug(...rest);
  }

  /**
   * @param {string} id
   * @param {{}} stats
   * @param {[]} rest
   */
  info(id, stats, ...rest) {
    this._logger.info(...rest);
  }

  /**
   * @param {string} id
   * @param {{}} stats
   * @param {[]} rest
   */
  warn(id, stats, ...rest) {
    this._logger.warn(...rest);
  }

  /**
   * @param {string} id
   * @param {{}} stats
   * @param {[]} rest
   */
  error(id, stats, ...rest) {
    this._logger.error(...rest);
  }
}

module.exports = Bunyan;

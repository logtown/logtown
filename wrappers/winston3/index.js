'use strict';

const winston = require('winston');
const util = require('util');

const DEFAULT_TRANSPORTS = [
  new winston.transports.Console({
    handleExceptions: true
  })
];

/**
 * Logtown winston wrapper
 */
class Winston {

  /**
   * @param {[]} transports
   * @param {{}} winstonOptions
   */
  constructor(transports = DEFAULT_TRANSPORTS, winstonOptions = { exitOnError: true }) {
    this._logger = winston.createLogger({
      exitOnError: true,
      ...winstonOptions,
      transports: transports
    });
  }

  /**
   *
   * @param {string} id
   * @param {string} level
   * @param {{}} stats
   * @param {[]} rest
   */
  log(id, level, stats, ...rest) {
    this._logger[level.toLowerCase()](util.format(`[${id}]`, ...rest));
  }
}

module.exports = Winston;

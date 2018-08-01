'use strict';

const winston = require('winston');

const DEFAULT_TRANSPORTS = [
  new winston.transports.Console({
    json: false,
    colorize: true,
    prettyPrint: true,
    timestamp: true,
    handleExceptions: true,
    align: false,
    level: 'silly'
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
    this._logger = new winston.Logger(Object.assign(
      { exitOnError: true },
      winstonOptions,
      { transports: transports }
    ));
  }

  /**
   *
   * @param {string} id
   * @param {string} level
   * @param {{}} stats
   * @param {[]} rest
   */
  log(id, level, stats, ...rest) {
    this._logger[level.toLowerCase()](`[${id}]`, ...rest);
  }
}

module.exports = Winston;

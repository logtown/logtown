'use strict';

const winston = require('winston');
const OptionsHolder = require('../options-holder');

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

class WinstonWrapper extends OptionsHolder {
  constructor(transports = DEFAULT_TRANSPORTS, winstonOpts = {exitOnError: true}, options = {}) {
    super(options);

    this._logger = new winston.Logger(
      Object.assign(
        {exitOnError: true},
        winstonOpts,
        {transports: transports}
      )
    );
  }

  silly(id, stats, ...rest) {
    this._logger.silly(`[${id}]`, ...rest);
  }

  debug(id, stats, ...rest) {
    this._logger.debug(`[${id}]`, ...rest);
  }

  info(id, stats, ...rest) {
    this._logger.info(`[${id}]`, ...rest);
  }

  warn(id, stats, ...rest) {
    this._logger.warn(`[${id}]`, ...rest);
  }

  error(id, stats, ...rest) {
    this._logger.error(`[${id}]`, ...rest);
  }
}

module.exports = WinstonWrapper;

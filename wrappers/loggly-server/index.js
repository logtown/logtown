'use strict';

const loggly = require('loggly');
const util = require('util');

module.exports = class Loggly {
  /**
   * @see https://github.com/winstonjs/node-loggly#getting-started
   * @param options
   */
  constructor(options = {}) {
    this.client = loggly.createClient(options);
  }

  static logOptions = {
    passInitialArguments: true
  };

  log(id, level, stats, ...rest) {
    const message = util.format(`[${level}]`, `[${id}]`, ...rest.map((v) => (v instanceof Error) ? (v.stack || v.toString()) : v));
    this.client.log(message, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
};

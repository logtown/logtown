'use strict';

const debug = require('debug');

/**
 * Logtown debug wrapper
 */
function Debug(...rest) {
  if (new.target) {
    /**
     * @param id
     * @param stats
     * @param rest
     */
    this.debug = (id, stats, ...rest) => {
      debug(id)(...rest);
    };
    return;
  }
  return new Debug(...rest);
}

module.exports = Debug;

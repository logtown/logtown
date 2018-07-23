'use strict';

import Raven from 'raven-js/src/singleton';

/**
 * Logtown sentry wrapper for browser
 */
class Sentry {

  /**
   * @param {string} domain
   * @param {string} appId
   */
  constructor(domain, appId) {
    Raven.config(`https://${domain}@app.getsentry.com/${appId}`).install();
  }

  /**
   * @param {string} id
   * @param {{}} stats
   * @param {[]} rest
   */
  error(id, stats, ...rest) {
    let err = rest.find(err => err instanceof Error);
    if (err) {
      err.submessage = rest;
    } else {
      err = rest.join('');
    }
    Raven.captureException(err);
  }
}

export default Sentry;

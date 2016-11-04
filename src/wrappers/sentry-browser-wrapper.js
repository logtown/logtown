'use strict';

const Raven = require('raven-js/src/singleton');
const _ = require('lodash');

class SentryWrapper {
  constructor(domain, appId) {
    Raven.config(`https://${domain}@app.getsentry.com/${appId}`).install()
  }

  error(id, stats, ...rest) {
    let err = _.find(rest, (err) => err instanceof Error);
    if (err) {
      err.submessage = rest;
    } else {
      err = rest.join('');
    }
    Raven.captureException(err);
  }
}

module.exports = SentryWrapper;

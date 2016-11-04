'use strict';

const Raven = require('raven');
const util = require('util');
const _ = require('lodash');

class SentryAppender {
  constructor(url, env = process.env.NODE_ENV) {
    this._client = new Raven.Client(url);

    this.env = env;

    // always catch global exceptions
    this._client.patchGlobal(() => {
      console.log('Uncaught exception, reported to Sentry, shutting down..');
      process.exit(1)
    });

    this._client.on('error', (err) => {
      console.error("Sentry error:", err.message)
    });
  }

  warn(id, stats, ...rest) {
    let opts = {
      extra: {
        source: 'backend',
        logger: id,
        environment: this.env,
        message: _.head(rest)
      },
      level: 'warn'
    };

    this.send('captureMessage', util.format(...rest), opts);
  }

  error(id, stats, ...rest) {
    let err = _.find(rest, (e) => e instanceof Error);
    if (!(err instanceof Error)) {
      return this.warn(id, stats, ...rest)
    }

    let opts = {
      extra: {
        source: 'backend',
        logger: id,
        environment: this.env,
        message: _.toString(err)
      },
      level: 'error'
    };

    this.send('captureException', err, opts);
  }

  send(method, msg, opts) {
    try {
      this._client[method](msg, opts, this.callback.bind(this));
    } catch (e) {
      console.error(e);
    }
  }

  callback(result) {
    if (this._client && this._client.getIdent) {
      console.info('Sentry result: ' + this._client.getIdent(result));
    }
  }
}

module.exports = SentryAppender;

'use strict';

const Raven = require('raven');
const util = require('util');

/**
 * Logtown sentry wrapper for browser
 */
class Sentry {

  /**
   * @param {string} url
   * @param {string} env
   */
  constructor(url, env = process.env.NODE_ENV) {
    this._client = new Raven.Client(url);

    this.env = env;

    // always catch global exceptions
    this._client.patchGlobal(() => {
      console.log('Uncaught exception, reported to Sentry, shutting down..');
      process.exit(1)
    });

    this._client.on('error', (err) => {
      console.error('Sentry error:', err.message)
    });
  }

  /**
   * @param {string} id
   * @param {{}} stats
   * @param {[]} rest
   */
  warn(id, stats, ...rest) {
    let opts = {
      extra: {
        source: 'backend',
        logger: id,
        environment: this.env,
        message: rest[0]
      },
      level: 'warn'
    };

    this.send('captureMessage', util.format(...rest), opts);
  }

  /**
   * @param {string} id
   * @param {{}} stats
   * @param {[]} rest
   */
  error(id, stats, ...rest) {
    let err = rest.find(e => e instanceof Error);
    if (!(err instanceof Error)) {
      this.warn(id, stats, ...rest);
      return;
    }

    let opts = {
      extra: {
        source: 'backend',
        logger: id,
        environment: this.env,
        message: (err + '')
      },
      level: 'error'
    };

    this.send('captureException', err, opts);
  }

  /**
   * @param {string} method
   * @param {string} msg
   * @param {{}} opts
   */
  send(method, msg, opts) {
    try {
      this._client[method](msg, opts, this.callback.bind(this));
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * @param {string} result
   */
  callback(result) {
    if (this._client && this._client.getIdent) {
      console.info('Sentry result: ' + this._client.getIdent(result));
    }
  }
}

module.exports = Sentry;

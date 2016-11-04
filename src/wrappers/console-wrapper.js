'use strict';

const _ = require('lodash');

const OptionsHolder = require('../options-holder');

const padUtils = require('../utils/pad');
const colorUtils = require('../utils/color');

class ConsoleWrapper extends OptionsHolder {
  constructor(options = {throwOnError: true, pad: true}) {
    super(options);
  }

  formatTitle(level, id, stats = {maxIdLength: 0}) {
    let title = `${level} [${id}]`;
    if (this.getOption('pad', true) === true) {
      return padUtils.format(title, stats.maxIdLength + 6);
    }
    return title;
  }

  silly(id, stats, ...rest) {
    console.log(this.formatTitle('SILLY', id, stats), ...rest);
  }

  debug(id, stats, ...rest) {
    console.log('%c' + this.formatTitle('DEBUG', id, stats), `color: ${colorUtils.next()};`, ...rest);
  }

  info(id, stats, ...rest) {
    console.info('%c' + this.formatTitle('INFO', id, stats), `color: green;`, ...rest);
  }

  warn(id, stats, ...rest) {
    console.warn(this.formatTitle('WARN', id, stats), ...rest);
  }

  error(id, stats, ...rest) {
    console.error(this.formatTitle('ERROR', id, stats), ...rest);

    if (this.getOption('throwOnError', true) === true) {
      /* eslint-enable no-console */
      try {
        // This error was thrown as a convenience so that if you enable
        // "break on all exceptions" in your console,
        // it would pause the execution at this line.
        throw new Error(_.find(rest, (e) => e instanceof Error) || _.head(rest));
        /* eslint-disable no-empty */
      } catch (e) {
      }
      /* eslint-enable no-empty */
    }
  }
}

module.exports = ConsoleWrapper;

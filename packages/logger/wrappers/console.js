'use strict';

import pad from 'pad';
import {next} from '../utils/color';

/**
 * Default wrapper implementation for simple console browser output
 */
class Console {
  /**
   * @param {boolean} throwOnError
   * @param {boolean} padTitle
   */
  constructor({throwOnError = false, padTitle = false} = {}) {
    this.options = {throwOnError: !!throwOnError, pad: !!padTitle};
  }

  /**
   * Formats the title of the message. Example: "SILLY [namespace]"
   * Optionally it can pad the output to make each line to begin from the same place, for instance:
   *
   * <pre>
   * SILLY [example1] Message
   * DEBUG [exmpl2]   Message 2
   * WARN  [hello]    Message 3
   * </pre>
   *
   * @param {string} id
   * @param {string} level
   * @param {number} maxIdLength
   * @return {string}
   */
  formatTitle(id, level, maxIdLength = 0) {
    if (this.options.pad) {
      return pad(`${pad(level, 5)} [${id}]`, maxIdLength + 9);
    }
    return `${level} [${id}]`;
  }

  /**
   * Logs everything in console except error
   *
   * @param {string} id
   * @param {string} level
   * @param {number} maxIdLength
   * @param {[]} rest
   */
  log(id, level, {maxIdLength = 0} = {}, ...rest) {
    let method = console.log.bind(console);
    if (typeof console[level.toLowerCase()] === 'function') {
      method = console[level.toLowerCase()].bind(console);
    }
    method('%c' + this.formatTitle(id, level.toUpperCase(), maxIdLength), `color: ${next(id)};`, ...rest);
  }

  /**
   * Logs error message in console. if `throwOnError` options is `true`, throws first error defined
   * in method params to catch it in console if "break on all exceptions" enabled.
   *
   * @param {string} id
   * @param {number} maxIdLength
   * @param {[]} rest
   */
  error(id, {maxIdLength = 0} = {}, ...rest) {
    console.error('%c' + this.formatTitle(id, 'ERROR', maxIdLength), `color: ${next(id)};`, ...rest);

    if (this.options.throwOnError) {
      /* eslint-enable no-console */
      try {
        // This error was thrown as a convenience so that if you enable
        // "break on all exceptions" in your console,
        // it would pause the execution at this line.
        throw new Error(rest.find(e => e instanceof Error) || rest[0]);
        /* eslint-disable no-empty */
      } catch (e) {
      }
      /* eslint-enable no-empty */
    }
  }
}

export default Console;

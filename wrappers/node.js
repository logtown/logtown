'use strict';

const pad = require('pad');

class Node {
  constructor({padTitle = false} = {}) {
    this.options = {pad: !!padTitle};
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
   * Logs everything to console
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
    method(this.formatTitle(level.toUpperCase(), id, maxIdLength), ...rest);
  }
}

module.exports = Node;

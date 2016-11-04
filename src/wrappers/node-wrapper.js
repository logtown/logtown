'use strict';

const OptionsHolder = require('../options-holder');
const padUtils = require('../utils/pad');

class NodeWrapper extends OptionsHolder {

  constructor(options = {pad: false}) {
    super(options);
  }

  formatTitle(level, id, stats = {maxIdLength: 0}) {
    let title = `${level} [${id}]`;
    if (this.getOption('pad', false) === true) {
      return padUtils.format(title, stats.maxIdLength + 6);
    }
    return title;
  }

  silly(id, stats, ...rest) {
    console.log(this.formatTitle('SILLY', id, stats), ...rest);
  }

  debug(id, stats, ...rest) {
    console.log(this.formatTitle('DEBUG', id, stats), ...rest);
  }

  info(id, stats, ...rest) {
    console.log(this.formatTitle('INFO', id, stats), ...rest);
  }

  warn(id, stats, ...rest) {
    console.log(this.formatTitle('WARN', id, stats), ...rest);
  }

  error(id, stats, ...rest) {
    console.error(this.formatTitle('ERROR', id, stats), ...rest);
  }
}

module.exports = NodeWrapper;

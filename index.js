'use strict';

import _ from 'lodash';
import EmptyObject from 'ember-empty-object';

const loggers = new EmptyObject();
const configs = new EmptyObject();
const wrappers = [];
const LEVELS = Object.freeze({SILLY: 'SILLY', DEBUG: 'DEBUG', INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR'});

/**
 * Send log message to all available wrappers
 *
 * @param {string} id
 * @param {string} level
 * @param {[]} rest
 */
function sendMessage(id, level, ...rest) {
  let options = _.merge(
    {},
    _.get(configs, `namespaces.${id}`, {}),
    {disable: _.get(configs, 'disable', [])},
    _.omit(configs, ['namespaces', 'disable']),
    {disable: configs.useGlobal ? _.get(global, `logtown.namespaces.${id}.disable`, []) : []}
  );
  options.disable = options.disable.map(d => d.toUpperCase());

  let stats = calcStats();
  let levelMethod = level.toLowerCase();

  wrappers.concat(options.wrappers)
    .filter((w) => options.disable.indexOf(level.toUpperCase()) === -1)
    .forEach((wrapper) => {
      if (_.isFunction(wrapper[levelMethod])) {
        return wrapper[levelMethod](id, stats, ...rest);
      } else if (_.isFunction(wrapper.log)) {
        return wrapper.log(id, level, stats, ...rest);
      }
    });
}

/**
 * Prepare stats. Currently only maxIdLength supported
 *
 * @return {{maxIdLength: number}}
 */
function calcStats() {
  return {
    maxIdLength: Math.max(...Object.keys(loggers).map((l) => l.length))
  };
}

/**
 * Creating new logger instance
 *
 * @param {string} id
 * @return {{id, silly: (function(...[*])), debug: (function(...[*])), info: (function(...[*])), warn: (function(...[*])), error: (function(...[*]))}}
 */
function createLogger(id) {
  let log = _.partial(sendMessage, id);
  return {
    get id() {
      return id;
    },
    silly(...rest) {
      log(LEVELS.SILLY, ...rest);
    },
    debug(...rest) {
      log(LEVELS.DEBUG, ...rest);
    },
    info(...rest) {
      log(LEVELS.INFO, ...rest);
    },
    warn(...rest) {
      log(LEVELS.WARN, ...rest);
    },
    error(...rest) {
      log(LEVELS.ERROR, ...rest);
    }
  }
}

/**
 * Returns array if not array is passed to the function
 *
 * @param {[]|any} value
 * @return {[]}
 */
function normalizeArray(value = []) {
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
}

/**
 * Get logger that exits or create new one
 *
 * @param {String} id
 * @param {[]} disable
 * @param {[]} wrappers
 * @returns {{silly: Function, debug: Function, info: Function, warn: Function, error: Function}}
 */
function getLogger(id, {disable = [], wrappers = []} = {}) {
  let config = {
    disable: normalizeArray(disable).map(_.toString),
    wrappers: normalizeArray(wrappers)
  };

  _.set(configs, `namespaces.${id}`, _.merge(_.get(configs, `namespaces.${id}`, {}), config));

  return loggers[id] || (loggers[id] = createLogger(id));
}

/**
 * Add global configs
 *
 * @param {boolean} useGlobal
 * @param {[]} disable
 * @param {{}} namespaces
 */
function configure({useGlobal = true, disable = [], namespaces = {}} = {}) {
  let config = {useGlobal: !!useGlobal, disable: normalizeArray(disable).map(_.toString), namespaces};
  _.merge(configs, config);
}

/**
 * Add new wrapper. Can handle any object with one of methods from array:
 * ['log', 'silly', 'debug', 'info', 'warn', 'error']
 *
 * @param {{log?: Function, silly?: Function, debug?: Function, info?: Function, warn?: Function, error?: Function}|Function} wrapper
 */
function addWrapper(wrapper) {
  if (_.isFunction(wrapper.log) || Object.keys(LEVELS).some((level) => _.isFunction(wrapper[level.toLowerCase()]))) {
    wrappers.push(wrapper);
    return;
  }
  if (typeof wrapper === 'function') {
    wrappers.push({log: wrapper});
    return;
  }
  throw new Error('Wrapper did not implemented a minimum methods required');
}

/**
 * Factory method which returns logger. alias to getLogger()
 *
 * @param {String} id
 * @param {[]} disable
 * @param {[]} wrappers
 * @returns {{silly: Function, debug: Function, info: Function, warn: Function, error: Function}}
 */
const factory = (...args) => {
  return getLogger(...args);
};

factory.getLogger = getLogger;
factory.configure = configure;
factory.addWrapper = addWrapper;
factory.LEVELS = LEVELS;

/**
 * @type {{getLogger: ((id:String, config?:{disable, wrappers})=>{silly, debug, info, warn, error}), configure: ((config?)), addWrapper: ((wrapper?)), LEVELS: Object}}
 */
export default factory;

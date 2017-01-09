'use strict';

import EmptyObject from 'ember-empty-object';
import lget from 'lodash.get';
import lmerge from 'lodash.merge';
import lset from 'lodash.set';
import lomit from 'lodash.omit';

const loggers = new EmptyObject();
const configs = new EmptyObject();
const wrappers = [];
const LEVELS = Object.freeze({SILLY: 'SILLY', DEBUG: 'DEBUG', INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR'});

/**
 * Send log message to all available wrappers
 *
 * @param {string} id
 * @param {string} level
 * @param {boolean} fallbackToLog
 * @param {[]} rest
 */
function sendMessage(id, level, fallbackToLog, ...rest) {
  let options = lmerge(
    {},
    lget(configs, `namespaces.${id}`, {}),
    {disable: lget(configs, 'disable', [])},
    lomit(configs, ['namespaces', 'disable']),
    {disable: configs.useGlobal ? lget(global, `logtown.namespaces.${id}.disable`, []) : []}
  );
  options.disable = options.disable.map(d => d.toUpperCase());

  let stats = calcStats();
  let levelMethod = level.toLowerCase();

  wrappers.concat(options.wrappers)
    .filter((w) => options.disable.indexOf(level.toUpperCase()) === -1)
    .forEach((wrapper) => {
      if (typeof wrapper[levelMethod] === 'function') {
        return wrapper[levelMethod](id, stats, ...rest);
      } else if (typeof wrapper.log === 'function' && !!fallbackToLog) {
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
 * Create new logger instance
 *
 * @param {string} id
 * @return {{id, silly: (function(...[*])), debug: (function(...[*])), info: (function(...[*])), warn: (function(...[*])), error: (function(...[*]))}}
 */
function createLogger(id) {
  let log = (level, fallbackToLog, ...rest) => sendMessage(id, level, fallbackToLog, ...rest);
  return {
    get id() {
      return id;
    },
    silly(...rest) {
      log(LEVELS.SILLY, true, ...rest);
    },
    debug(...rest) {
      log(LEVELS.DEBUG, true, ...rest);
    },
    info(...rest) {
      log(LEVELS.INFO, true, ...rest);
    },
    warn(...rest) {
      log(LEVELS.WARN, true, ...rest);
    },
    error(...rest) {
      log(LEVELS.ERROR, true, ...rest);
    },
    // CAUTION: experimental feature
    send(level, ...rest) {
      log(level, false, ...rest);
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
    disable: normalizeArray(disable).map(v => v + ''),
    wrappers: normalizeArray(wrappers)
  };

  lset(configs, `namespaces.${id}`, lmerge(lget(configs, `namespaces.${id}`, {}), config));

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
  let config = {useGlobal: !!useGlobal, disable: normalizeArray(disable).map(v => v + ''), namespaces};
  lmerge(configs, config);
}

/**
 * Add new wrapper. Can handle any object with one of methods from array:
 * ['log', 'silly', 'debug', 'info', 'warn', 'error']
 *
 * @param {{log?: Function, silly?: Function, debug?: Function, info?: Function, warn?: Function, error?: Function}|Function} wrapper
 */
function addWrapper(wrapper) {
  if (typeof wrapper.log === 'function' || Object.keys(LEVELS).some(level => typeof wrapper[level.toLowerCase()] === 'function')) {
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

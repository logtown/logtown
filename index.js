'use strict';

import EmptyObject from 'ember-empty-object';
import lget from 'lodash.get';
import lmerge from 'lodash.merge';
import lset from 'lodash.set';
import lomit from 'lodash.omit';

const loggers = new EmptyObject();
const configs = new EmptyObject();
const wrappers = [];
const plugins = [];
const LEVELS = Object.freeze({SILLY: 'SILLY', DEBUG: 'DEBUG', INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR'});

function cloneFast(obj) {
  return JSON.parse(JSON.stringify(obj));
}

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
  const tagsToDisable = lget(configs, 'tags.disable', []);
  const namespaceTags = lget(configs, `namespaces.${id}.tags`, []);
  const containsDisabledTag = tagsToDisable.some(function (element) {
    return namespaceTags.indexOf(element) > -1;
  });

  let stats = calcStats();
  const levelMethod = level.toLowerCase();
  let logArgs = applyPlugins(id, level, stats, ...rest);
  if (logArgs.length === 0) {
    logArgs = [id, level, stats, ...rest];
  }

  let logArgsWithoutLevel = cloneFast(logArgs);
  logArgsWithoutLevel.splice(1, 1);

  if (options.disable.indexOf(level) > -1 ||
    containsDisabledTag) {
    return;
  }

  wrappers.concat(options.wrappers)
    .forEach((wrapper) => {
      if (typeof wrapper[levelMethod] === 'function') {
        return wrapper[levelMethod](...logArgsWithoutLevel);
      } else if (typeof wrapper.log === 'function' && !!fallbackToLog) {
        return wrapper.log(...logArgs);
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
 * @param {string} id
 * @param {string} level
 * @param {{}} stats
 * @param {*} rest
 * @return {[]}
 */
function applyPlugins(id, level, stats, ...rest) {
  return plugins.reduce((acc, pluginFn) => {
    if (!Array.isArray(acc)) {
      throw new Error('Plugin must return array');
    }
    if (acc.length === 0) {
      console.warn(`Possible error. Some of the plugins returned empty array.`);
    }
    return pluginFn(...acc);
  }, [id, level, stats, ...rest]);
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
 * @param {[]} tags
 * @returns {{silly: Function, debug: Function, info: Function, warn: Function, error: Function}}
 */
function getLogger(id, {disable = [], wrappers = [], tags = []} = {}) {
  let config = {
    disable: normalizeArray(disable).map(v => v + ''),
    wrappers: normalizeArray(wrappers),
    tags: normalizeArray(tags)
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
 * @param {{}} tags
 */
function configure({useGlobal = true, disable = [], namespaces = {}, tags = {}} = {}) {
  let config = {
    useGlobal: !!useGlobal,
    disable: normalizeArray(disable).map(v => v + ''),
    namespaces,
    tags: { disable: normalizeArray(lget(tags, 'disable', [])) }
  };
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
 * Add plugin function. Plugin function must return array with log argument values.
 */
function addPlugin(useLevel, fn) {
  let pluginFn = fn;
  if (typeof fn === 'undefined' && typeof useLevel === 'function') {
    pluginFn = useLevel;
  }

  if (typeof pluginFn !== 'function') {
    throw new Error('Plugin must be a function!');
  }

  if (typeof useLevel === 'string') {
    pluginFn = function (id, level, stats, ...rest) {
      if (level === useLevel.toUpperCase()) {
        return fn(id, level, stats, ...rest);
      }
      return [id, level, stats, ...rest];
    };
  }

  plugins.push(pluginFn);
}

/**
 * The method is intended to be used during testing. Should not be used.
 */
function clean() {
  wrappers.splice(0, wrappers.length);
  plugins.splice(0, plugins.length);
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
factory.addPlugin = addPlugin;
factory.LEVELS = LEVELS;
factory.clean = clean;

/**
 * @type {{getLogger: ((id:String, config?:{disable, wrappers})=>{silly, debug, info, warn, error}), configure: ((config?)), addWrapper: ((wrapper?)), LEVELS: Object}}
 */
export default factory;

'use strict';

import get from 'dlv';
import set from 'dset';
import deepmerge from 'deepmerge';

const loggers = Object.create(null);
let configRegistry = Object.create(null);
const wrappers = [];
const pluginsRegistry = [];
const LEVELS = Object.freeze({ SILLY: 'SILLY', DEBUG: 'DEBUG', INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR' });
const WRAPPER_OPTS_SYMBOL = Symbol();
const WRAPPER_OPTS_KEY = 'logOptions';
const WRAPPER_PLUGINS_KEY = 'logPlugins';

function buildMessageOptions(id) {
  const { namespaces, disable, ...confs } = configRegistry;
  let options = deepmerge.all([
    {},
    get(configRegistry, `namespaces.${id}`, {}),
    { disable: get(configRegistry, 'disable', []) },
    confs,
    { disable: configRegistry.useGlobal ? get(global, `logtown.namespaces.${id}.disable`, []) : [] }
  ]);
  options.disable = options.disable.map(d => d.toUpperCase());
  return options;
}

function equalsWrapperOptValue(wrapper, opt, value) {
  return get(wrapper, ['constructor', WRAPPER_OPTS_KEY, opt]) === value || get(wrapper, [WRAPPER_OPTS_SYMBOL, opt]) === value;
}

function extractWrapperPlugins(wrapper) {
  return get(wrapper, ['constructor', WRAPPER_PLUGINS_KEY]) || get(wrapper, [WRAPPER_OPTS_SYMBOL, 'plugins']);
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
  const levelMethod = level.toLowerCase();
  const options = buildMessageOptions(id);
  const tagsToDisable = get(configRegistry, 'tags.disable', []);
  const namespaceTags = get(configRegistry, `namespaces.${id}.tags`, []);
  const containsDisabledTag = tagsToDisable.some((element) => {
    return namespaceTags.indexOf(element) > -1;
  });

  if (options.disable.indexOf(level) > -1 ||
    containsDisabledTag) {
    // if global or logger's setting is saying to disable logging, proceed silently
    if (!!configRegistry.verbose) {
      console.log(`Level ${level} or namespace ID ${id} has been disabled. skipping...`);
    }
    return;
  }

  const [, , stats, ...args] = applyPlugins(pluginsRegistry, id, level, calcStats(), ...rest);

  wrappers.concat(options.wrappers)
    .forEach((wrapper) => {
      const restOrArgs = equalsWrapperOptValue(wrapper, 'passInitialArguments', true) ? rest : args;
      const plugins = extractWrapperPlugins(wrapper);
      const [, , wrapperStats, ...wrapperArgs] = applyPlugins(plugins, id, level, stats, ...restOrArgs);

      if (typeof wrapper[levelMethod] === 'function') {
        // use specific logging method if exists, for example, wrapper.info()
        return wrapper[levelMethod](id, wrapperStats, ...wrapperArgs);
      } else if (typeof wrapper.log === 'function' && !!fallbackToLog) {
        // use generic log method, if fallbackToLog === true. It is always equal to TRUE for standard levels
        return wrapper.log(id, level, wrapperStats, ...wrapperArgs);
      }
      if (!!configRegistry.verbose) {
        console.log(`Wrapper has no valid logging method. fallbackToLog is equal ${fallbackToLog}. skipping...`);
      }
    });
}

/**
 * Prepare stats. Currently only maxIdLength supported in core, can be extended
 * in custom plugin.
 *
 * @return {{maxIdLength: number}}
 */
function calcStats() {
  return {
    maxIdLength: Math.max(...Object.keys(loggers).map((l) => l.length))
  };
}

/**
 * Run all plugins. Must return always non empty array with [id, level, stats, ...rest]
 *
 * @param {[]} plugins
 * @param {string} id
 * @param {string} level
 * @param {{}} stats
 * @param {*} rest
 * @return {[]}
 */
function applyPlugins(plugins = [], id, level, stats, ...rest) {
  if (!Array.isArray(plugins) || !plugins.every((p) => typeof p === 'function')) {
    throw new Error('Plugins MUST be an array of functions');
  }
  const args = Object.freeze(rest.map((arg) => Object.freeze(arg)));
  // mutable context object that passes into plugin function and
  // should be modified with new args or stats
  // id, level and initial arguments array MUST not be modified
  const ctx = {
    get id() {
      return id
    },
    get level() {
      return level
    },
    get arguments() {
      return args
    },
    stats,
    args: rest
  };

  plugins.forEach((pluginFn) => {
    pluginFn(ctx);
  });
  const resArgs = Array.isArray(ctx.args) && ctx.args.length ? ctx.args : ctx.arguments;
  return [id, level, ctx.stats, ...resArgs];
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
function getLogger(id, { disable = [], wrappers = [], tags = [] } = {}) {
  let config = {
    disable: normalizeArray(disable).map(v => v + ''),
    wrappers: normalizeArray(wrappers),
    tags: normalizeArray(tags)
  };

  set(configRegistry, `namespaces.${id}`, deepmerge(get(configRegistry, `namespaces.${id}`, {}), config));

  return loggers[id] || (loggers[id] = createLogger(id));
}

/**
 * Add global configs
 *
 * @param {boolean} useGlobal
 * @param {[]} disable
 * @param {{}} namespaces
 * @param {{}} tags
 * @param {boolean} verbose
 * @param {boolean} override
 */
function configure({ useGlobal = true, disable = [], namespaces = {}, tags = {}, verbose = false } = {}, override = false) {
  const config = Object.create(null);
  config.useGlobal = !!useGlobal;
  config.disable = normalizeArray(disable).map(v => v + '');
  config.namespaces = namespaces;
  config.tags = {
    disable: normalizeArray(get(tags, 'disable', []))
  };
  config.verbose = verbose;
  configRegistry = override ? config : deepmerge(configRegistry, config);
}

/**
 * Add new wrapper. Can handle any object with one of methods from array:
 * ['log', 'silly', 'debug', 'info', 'warn', 'error']
 *
 * @param {{log?: Function, silly?: Function, debug?: Function, info?: Function, warn?: Function, error?: Function}|Function} wrapper
 * @param {{}} opts
 */
function addWrapper(wrapper, { passInitialArguments = false, plugins = [] } = {}) {
  const opts = {
    passInitialArguments,
    plugins: normalizeArray(plugins)
  };
  if (
    typeof wrapper === 'object' && !Array.isArray(wrapper)
    &&
    (
      typeof wrapper.log === 'function' ||
      Object.keys(LEVELS).some((lvl) => typeof wrapper[lvl.toLowerCase()] === 'function')
    )
  ) {
    // if wrapper is instance of some class or pure object, it must include at least one method with level name
    wrapper[WRAPPER_OPTS_SYMBOL] = opts;
    wrappers.push(wrapper);
    return;
  }
  if (typeof wrapper === 'function') {
    const wrapperObject = {
      log: wrapper,
      [WRAPPER_OPTS_SYMBOL]: opts
    };
    wrappers.push(wrapperObject);
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
    pluginFn = (id, level, stats, ...rest) => {
      if (level === useLevel.toUpperCase()) {
        return fn(id, level, stats, ...rest);
      }
      return [id, level, stats, ...rest];
    };
  }

  pluginsRegistry.push(pluginFn);
}

function cleanPlugins() {
  pluginsRegistry.splice(0, pluginsRegistry.length);
}

function cleanWrappers() {
  wrappers.splice(0, wrappers.length);
}

/**
 * Clean wrappers, plugins and configurations
 */
function cleanAll() {
  cleanWrappers();
  cleanPlugins();
  configure({}, true);
}

/**
 * Factory method which returns logger. alias to getLogger()
 *
 * @param {string} id
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
factory.cleanAll = cleanAll;
factory.cleanWrappers = cleanWrappers;
factory.cleanPlugins = cleanPlugins;

/**
 * @type {{getLogger: ((id:String, config?:{disable, wrappers})=>{silly, debug, info, warn, error}), configure: ((config?)), addWrapper: ((wrapper?)), LEVELS: Object}}
 */
export default factory;

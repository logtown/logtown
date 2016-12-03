'use strict';

const _ = require('lodash');

const EmptyObject = require('ember-empty-object');

const loggers = new EmptyObject();
const configs = new EmptyObject();
const wrappers = [];
const LEVELS = Object.freeze({SILLY: 'SILLY', DEBUG: 'DEBUG', INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR'});

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

function calcStats() {
  return {
    maxIdLength: Math.max(...Object.keys(loggers).map((l) => l.length))
  };
}

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

function normalizeArray(value = []) {
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
}

module.exports = {
  /**
   * @param {String} id
   * @param {{disable, wrappers}} config
   * @returns {{silly, debug, info, warn, error}}
   */
  getLogger(id, config = {disable: [], wrappers: []}) {
    if (!_.isObject(config)) {
      config = {};
    }
    config.disable = normalizeArray(config.disable).map(_.toString);
    config.wrappers = normalizeArray(config.wrappers);

    _.set(configs, `namespaces.${id}`, _.merge(_.get(configs, `namespaces.${id}`, {}), config));

    return loggers[id] || (loggers[id] = createLogger(id));
  },

  configure(config = {useGlobal: true, disable: [], namespaces: {}}) {
    if (!_.isObject(config)) {
      throw new Error('Logger.configure applies only objects.');
    }
    _.merge(configs, config, {
      useGlobal: !!_.get(config, 'useGlobal', true),
      disable: normalizeArray(config.disable).map(_.toString),
      namespaces: config.namespaces || {},
    });
  },

  addWrapper(wrapper) {
    if (_.isFunction(wrapper.log) || Object.keys(LEVELS).some((level) => _.isFunction(wrapper[level.toLowerCase()]))) {
      wrappers.push(wrapper);
      return;
    }
    throw new Error('Wrapper did not implemented a minimum methods required');
  },

  LEVELS: LEVELS
};

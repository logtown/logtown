'use strict';

import test from 'ava';

test('Logger executes custom wrapper via log method and SILLY level', t => {
  t.plan(3);
  const Logger = require('../es6/common');
  Logger.clean();

  const logger = Logger.getLogger('test1', {
    wrappers: [
      {
        log(id, level, stats, ...rest) {
          t.is(id, 'test1');
          t.is(level, 'SILLY');
          t.is(rest[0], 'message');
        },
      },
    ],
  });

  logger.silly('message');
});

test('Logger executes global wrapper via log method and DEBUG level', t => {
  t.plan(3);

  const Logger = require('../es6/common');
  Logger.clean();

  Logger.addWrapper({
    log(id, level, stats, ...rest) {
      t.is(id, 'test2');
      t.is(level, 'DEBUG');
      t.is(rest[0], 'message');
    },
  });

  const logger = Logger.getLogger('test2');
  logger.debug('message');
});

test('Logger will not execute disabled WARN level', t => {
  const Logger = require('../es6/common');
  Logger.clean();

  const logger = Logger.getLogger('test3');

  Logger.configure({
    disable: 'warn',
  });

  let wrapper = {
    warn() {
      console.log('This method must not be executed');
      t.fail();
    },
  };

  Logger.addWrapper(wrapper);

  logger.warn('message');
  t.pass();
});

test('Testing logger factory method to fetch it', t => {
  t.plan(3);

  const Logger = require('../es6/common');
  Logger.clean();

  Logger.addWrapper({
    log(id, level, stats, ...rest) {
      t.is(id, 'test2');
      t.is(level, 'DEBUG');
      t.is(rest[0], 'message');
    },
  });

  const logger = Logger('test2');
  logger.debug('message');
});

test('Add wrapper as function', t => {
  t.plan(6);

  const Logger = require('../es6/common');
  Logger.clean();

  Logger.addWrapper(function (id, level, stats, ...rest) {
    t.is(id, 'test3');
    t.is(level, 'DEBUG');
    t.is(rest[0], 'message');
  });

  Logger.addWrapper((id, level, stats, ...rest) => {
    t.is(id, 'test3');
    t.is(level, 'DEBUG');
    t.is(rest[0], 'message');
  });

  const logger = Logger.getLogger('test3');
  logger.debug('message');
});

test('Add plugin function', t => {

  const Logger = require('../es6/common');
  Logger.clean();

  const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
  const stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;

  const filelinePlugin = function (id, level, stats, ...rest) {
    let newStats = JSON.parse(JSON.stringify(stats)); // quick deep cloning
    let newRest = rest.slice();

    let err = rest.find((obj) => obj instanceof Error);

    let stacklist = (err || new Error()).stack.split('\n').slice(1);
    let s = stacklist[0];
    let sp = stackReg.exec(s) || stackReg2.exec(s);

    if (sp && sp.length === 5) {
      newStats.method = sp[1];
      newStats.path = sp[2];
      newStats.line = parseInt(sp[3], 10);
      newStats.pos = sp[4];
      newStats.file = newStats.path.split(/[\\/]/).pop();

      newRest.splice(0, 0, `(${newStats.path}:${newStats.line})`);
    }

    return [id, level, newStats, ...newRest];
  };

  Logger.addPlugin(filelinePlugin);

  let logger = Logger.getLogger('testing-plugin');

  Logger.addWrapper({
    error: function (id, stats, ...rest) {
      t.is(stats.line, 148);
      t.is(stats.file, 'index.js');
    },
  });

  logger.error(new Error('message'));

  t.pass();
});

test('Use tags to disable multiple loggers', t => {
  t.plan(3);

  const Logger = require('../es6/common');
  Logger.clean();

  Logger.addWrapper(function (id, level, stats, ...rest) {
    t.is(id, 'namespace3');
    t.is(level, 'DEBUG');
    t.is(rest[0], 'Acceptable logger');
  });

  Logger.configure({
    tags: {
      disable: ['my-lib'],
    },
  });

  const l1 = Logger.getLogger('namespace1', { tags: ['my-lib'] });
  const l2 = Logger.getLogger('namespace2', { tags: ['my-lib'] });
  const l3 = Logger.getLogger('namespace3');

  l1.debug('Hello World');
  l2.debug('One more hello');
  l3.debug('Acceptable logger');
});

test('Can log circular structures', t => {
  const Logger = require('../es6/common');
  Logger.clean();
  Logger.addWrapper(function (id, level, stats, ...rest) {
    t.is(rest[0], circular);
  });

  var circular = {};
  circular.circular = circular;

  const logger = Logger.getLogger('test');
  logger.info(circular);
  t.pass();
});

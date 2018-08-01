'use strict';

import test from 'ava';
import Logger from '../';
import stacktrace from '../plugins/stacktrace';

test.beforeEach(() => {
  Logger.clean();
});

test('Logger executes custom wrapper via log method and SILLY level', t => {
  t.plan(3);
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

test.serial('Add plugin function', t => {
  Logger.addPlugin(stacktrace());
  let logger = Logger.getLogger('testing-plugin');

  Logger.addWrapper({
    error: function (id, stats, ...rest) {
      t.is(stats.line, 108);
      t.is(stats.file, 'index.js');
    },
  });

  logger.error(new Error('message'));

  t.pass();
});

test.serial('Use tags to disable multiple loggers', t => {
  t.plan(3);

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

test.serial('Can log circular structures', t => {
  Logger.addWrapper(function (id, level, stats, ...rest) {
    t.is(rest[0], circular);
  });

  var circular = {};
  circular.circular = circular;

  const logger = Logger.getLogger('test');
  logger.info(circular);
  t.pass();
});

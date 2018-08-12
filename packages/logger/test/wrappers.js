'use strict';

import test from 'ava';
import Logger from '../index';

test.beforeEach(() => {
  Logger.cleanAll();
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
        }
      }
    ]
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
    }
  });

  const logger = Logger.getLogger('test2');
  logger.debug('message');
});

test('Testing logger factory method to fetch it', t => {
  t.plan(3);

  Logger.addWrapper({
    log(id, level, stats, ...rest) {
      t.is(id, 'test2');
      t.is(level, 'DEBUG');
      t.is(rest[0], 'message');
    }
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

'use strict';

import test from 'ava';
import Logger from '../index';
import NodeWrapper from '../wrappers/node';
import sinon from 'sinon';

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

// test('Get logger with node wrapper in options', t => {
//   const nodeWrapper = new NodeWrapper();
//   sinon.spy(nodeWrapper, 'log');
//
//   const logger = Logger.getLogger('test4', {
//     wrappers: [nodeWrapper]
//   });
//   logger.debug("Hello World");
//   t.is(nodeWrapper.log.called, true);
// });

'use strict';

const test = require('ava');

test('Logger executes custom wrapper via log method and SILLY level', t => {
  t.plan(3);

  const Logger = require('../');
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

  const Logger = require('../');
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

test('Logger will not execute disabled WARN level', t => {
  const Logger = require('../');
  const logger = Logger.getLogger('test3');

  Logger.configure({
    disable: 'warn'
  });

  let wrapper = {
    warn() {
      console.log('This method must not be executed');
      t.fail();
    }
  };

  Logger.addWrapper(wrapper);

  logger.warn('message');
  t.pass();
});

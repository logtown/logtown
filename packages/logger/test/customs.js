'use strict';

import test from 'ava';
import Logger from '../index';

test('Invokes wrapper\'s custom methods', (t) => {
  t.plan(7);

  Logger.addWrapper({
    log(id, level, stats, ...rest) {
      t.is(id, 'my-namespace');
      t.is(level, 'DEBUG');
      t.is(rest[0], 'Hello World');
    },
    group(id, stats, ...rest) {
      t.is(id, 'my-namespace');
      t.is(rest[0], 'Hello');
    },
    groupend(id, stats, ...rest) {
      t.is(id, 'my-namespace');
      t.is(rest[0], 'World');
    }
  });

  const logger = Logger.getLogger('my-namespace');
  logger.send('group', 'Hello');
  logger.debug('Hello World');
  logger.send('groupend', 'World');
});

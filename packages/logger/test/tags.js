import test from 'ava';
import Logger from '../index';

test.beforeEach(() => {
  Logger.cleanAll();
});

test('Use tags to disable multiple loggers', (t) => {
  t.plan(3);

  Logger.addWrapper(function (id, level, stats, ...rest) {
    t.is(id, 'namespace3');
    t.is(level, 'DEBUG');
    t.is(rest[0], 'Acceptable logger');
  });

  Logger.configure({
    tags: {
      disable: ['my-lib']
    }
  });

  const l1 = Logger.getLogger('namespace1', { tags: ['my-lib'] });
  const l2 = Logger.getLogger('namespace2', { tags: ['my-lib'] });
  const l3 = Logger.getLogger('namespace3');

  l1.debug('Hello World');
  l2.debug('One more hello');
  l3.debug('Acceptable logger');
});

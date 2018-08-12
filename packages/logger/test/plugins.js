import test from 'ava';
import Logger from '../index';
import stacktrace from '../plugins/stacktrace';

test.beforeEach(() => {
  Logger.cleanAll();
});

test.serial('Adding plugin function', (t) => {
  Logger.addPlugin(stacktrace());
  let logger = Logger.getLogger('testing-plugin');

  Logger.addWrapper({
    error: function (id, stats, ...rest) {
      t.is(stats.line, 20);
      t.is(stats.file, 'plugins.js');
    }
  });

  logger.error(new Error('message'));
  t.pass();
});

test.serial('Plugin can update context', (t) => {
  t.plan(4);
  const plugin = (ctx) => {
    t.is(ctx.id, 'plugin-test');
    t.is(ctx.level, 'DEBUG');
    t.deepEqual(ctx.arguments, ['a', 'b', 'c']);
    ctx.args = ['1', '2', '3'];
  };
  Logger.addPlugin(plugin);
  Logger.addWrapper((id, level, stats, ...rest) => {
    t.deepEqual(rest, ['1', '2', '3']);
  });
  const logger = Logger.getLogger('plugin-test');
  logger.debug('a', 'b', 'c');
});

test.serial('Plugin can\'t mutate context\'s fields', (t) => {
  t.plan(7);
  const plugin = (ctx) => {
    t.throws(() => {
      ctx.id = 'new id';
    }, TypeError);
    t.throws(() => {
      ctx.level = 'new level';
    }, TypeError);
    t.throws(() => {
      ctx.arguments = 42;
    }, TypeError);
    t.throws(() => {
      ctx.arguments[0] = 10;
    }, TypeError);
  };
  Logger.addPlugin(plugin);
  Logger.addWrapper((id, level, stats, ...rest) => {
    t.is(id, 'plugin-test-2');
    t.is(level, 'DEBUG');
    t.deepEqual(rest, ['Hello world']);
  });
  const logger = Logger.getLogger('plugin-test-2');
  logger.debug('Hello world');
});

test.serial('Wrapper with passInitialArguments configured to TRUE', (t) => {
  t.plan(1);
  const plugin = (ctx) => {
    ctx.args = [1, 2, 3];
  };
  Logger.addWrapper((id, level, stats, ...rest) => {
    t.deepEqual(rest, ['a', 'b', 'c']);
  }, {
    passInitialArguments: true,
  });
  Logger.addPlugin(plugin);
  const logger = Logger.getLogger('plugin-test-for-wrapper');
  logger.info('a', 'b', 'c');
});

test.serial('Plugin for specific wrapper', (t) => {
  t.plan(2);
  const plugin = (ctx) => {
    ctx.args = [1, 2, 3];
  };
  Logger.addWrapper((id, level, stats, ...rest) => {
    t.deepEqual(rest, [1, 2, 3]);
  }, {
    plugins: [plugin]
  });
  Logger.addWrapper((id, level, stats, ...rest) => {
    t.deepEqual(rest, ['a', 'b', 'c']);
  });
  const logger = Logger.getLogger('plugin-test-for-wrapper');
  logger.info('a', 'b', 'c');
});


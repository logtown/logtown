import test from 'ava';
import Logger from '../index';

test.beforeEach(() => {
  Logger.cleanAll();
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

test('Logger will avoid executing logging for specific namespace', (t) => {
  Logger.configure({
    namespaces: {
      'my-test-namespace': {
        disable: ['debug']
      }
    }
  });
  Logger.addWrapper({
    debug() {
      console.log('This method must not be executed');
      t.fail();
    }
  });
  const logger = Logger.getLogger('my-test-namespace');
  logger.debug('Hello World');
  t.pass();
});

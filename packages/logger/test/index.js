import test from 'ava';
import Logger from '../index';

test('Can log circular structures', t => {
  Logger.addWrapper(function (id, level, stats, ...rest) {
    t.is(rest[0], circular);
  });

  const circular = {};
  circular.circular = circular;

  const logger = Logger.getLogger('test');
  logger.info(circular);
  t.pass();
});

const stdMocks = require('std-mocks');
const Debug = require('../');
const logtown = require('logtown');
const test = require('tape');

logtown.addWrapper(new Debug());
const logger = logtown('debug-test');

function flush(ind = 0) {
  stdMocks.restore();
  const output = stdMocks.flush();
  if (ind < 0) {
    return output.stderr;
  }
  return output.stderr[ind];
}

test('basic debug test', (t) => {
  t.plan(1);

  stdMocks.use();
  logger.debug('hi');
  const record = flush();
  t.true(/debug-test hi\n$/.test(record));
});


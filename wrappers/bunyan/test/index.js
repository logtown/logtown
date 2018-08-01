const stdMocks = require('std-mocks');
const Bunyan = require('../');
const logtown = require('logtown');
const test = require('tape');

logtown.addWrapper(new Bunyan('name'));
const logger = logtown('bunyan-test');

function flush(ind = 0) {
  stdMocks.restore();
  const output = stdMocks.flush();
  if (ind < 0) {
    return output.stdout.map((rec) => JSON.parse(rec));
  }
  return JSON.parse(output.stdout[ind]);
}

test('basic info test', (t) => {
  t.plan(3);

  stdMocks.use();
  logger.info('hi');
  const record = flush();

  t.equal(record.name, 'name');
  t.equal(record.level, 30);
  t.equal(record.msg, 'hi');
});


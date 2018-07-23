const stdMocks = require('std-mocks');
const Winston = require('../');
const logtown = require('logtown');
const test = require('tape');
const winston = require('winston');

const transports = [
  new winston.transports.Console({
    json: false,
    colorize: false,
    prettyPrint: true,
    timestamp: false,
    handleExceptions: true,
    align: false,
    level: 'silly'
  })
];

logtown.addWrapper(new Winston(transports));
const logger = logtown('winston-test');

function flush(ind = 0) {
  stdMocks.restore();
  const output = stdMocks.flush();
  if (ind < 0) {
    return output.stdout;
  }
  return output.stdout[ind];
}

test('basic info test', (t) => {
  t.plan(1);

  stdMocks.use();
  logger.info('hi');
  const record = flush();
  t.equal(record, "info: [winston-test] hi\n");
});


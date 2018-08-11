'use strict';

const logtown = require('logtown');
const dumper = require('../');
const Winston = require('logtown-winston3');

logtown.addPlugin(dumper());
logtown.addWrapper(new Winston());

const logger = logtown.getLogger('happy-logging');
logger.error(new Error('Hello World'));
logger.warn({
  record: 'value',
  key2: 'value2'
});
logger.info([
  { user: 'barney', age: 36, active: true, createdAt: new Date(), getAge: () => this.age },
  { user: 'fred', age: 40, active: false, createdAt: new Date(), getAge: () => this.age },
  { user: 'pebbles', age: 1, active: true, createdAt: new Date(), getAge: () => this.age }
]);
logger.info('more arguments', 'than', 1, {
  record: 'value',
  key2: 'value2'
});

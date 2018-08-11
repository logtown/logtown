'use strict';

const logtown = require('logtown');
const prettyError = require('../');
const Winston = require('logtown-winston3');

logtown.addPlugin(prettyError());
logtown.addWrapper(new Winston());

const logger = logtown.getLogger('happy-logging');
logger.error(new Error('Hello World'));

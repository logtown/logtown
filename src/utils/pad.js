'use strict';

const pad = require('pad');

exports.format = (prefix, length) => {
  return pad(prefix, length);
};

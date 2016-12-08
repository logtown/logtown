'use strict';

const EmptyObject = require('ember-empty-object');

const colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

const colorMap = new EmptyObject();
let counter = 0;

exports.next = function (id = 'default') {
  if (id in colorMap) {
    return colors[colorMap[id]]
  }

  colorMap[id] = counter;
  counter += 1;
  return colors[colorMap[id] % colors.length]
};


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

exports.next = function (id = 'default') {
  colorMap[id] = (colorMap[id] | 0) + 1;
  return colors[Math.ceil(colorMap[id] / colors.length)]
};


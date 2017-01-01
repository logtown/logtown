'use strict';

/*
 * @fileoverview these are utils for browser color generation
 */


import EmptyObject from 'ember-empty-object';

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

/**
 * Get next color
 *
 * @param {string} id
 * @return {string}
 */
export const next = function (id = 'default') {
  if (id in colorMap) {
    return colors[colorMap[id]]
  }

  colorMap[id] = counter;
  counter += 1;
  return colors[colorMap[id] % colors.length]
};


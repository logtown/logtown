'use strict';

/*
 * @fileoverview these are utils for browser color generation
 */

const colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

const colorMap = Object.create(null);
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


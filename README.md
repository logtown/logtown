# Logtown

> Simple Logging Facade for JavaScript.

[![npm version](https://badge.fury.io/js/logtown.svg)](https://www.npmjs.com/package/logtown)
[![Build Status](https://travis-ci.org/logtown/logtown.svg?branch=master)](https://travis-ci.org/logtown/logtown)
[![Code Climate](https://codeclimate.com/github/logtown/logtown/badges/gpa.svg)](https://codeclimate.com/github/logtown/logtown)
[![CircleCI](https://circleci.com/gh/logtown/logtown/tree/master.svg?style=svg)](https://circleci.com/gh/logtown/logtown/tree/master)
[![dependencies:?](https://img.shields.io/david/logtown/logtown.svg)](https://david-dm.org/logtown/logtown)
[![devDependencies:?](https://img.shields.io/david/dev/logtown/logtown.svg?style=flat)](https://david-dm.org/logtown/logtown)
[![Inline docs](http://inch-ci.org/github/logtown/logtown.svg?branch=master)](http://inch-ci.org/github/logtown/logtown)

## Installation

```bash
npm install logtown --save
```

or 

```bash
yarn add logtown
```

## Usage

First of all you should notice, that `logtown` is not a logger. You can use any logger you want underneath, there are a 
lot of great tools like intel, winston and others.
And if you don't define any wrappers you won't see any output. There are several ready for use wrappers contained in the 
package. But you can use your own in any time.

So let's start from simple use case:
```javascript
const Logger = require('logtown');

// Adding wrapper is very simple, you need implement at least 1 method from this array ['log', 'silly', 'debug', 'info', 'warn', 'error']
// log method has only 1 difference from others it receives additional *level* parameter
Logger.addWrapper({
  log(id, level, stats, ...rest) {
    console[level](`[${id}] ${rest.join(' ')}`)
  }
})

// Once you added wrapper you can use logger in any place of your app
const logger = Logger.getLogger('mymodule-label');

logger.silly('Silly message');
logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warn message');
logger.error('Error message');
```

## Configuration

Logtown can be configured via 3 options: 
 
 * application level configurations
 * logger level configurations
 * global level configurations


 1. Application level is made by using `Logger.configure({})` static method.

    ```javascript
    const logger = Logger.configure({
      namespaces: {'mymodule': {disable: ['debug']}}, // disable one or more level for specific namespace
      useGlobal: false, // disable usage of global configurations, it is enabled by default
      disable: ['info', 'warn'] // disable globaly specific levels
    });
    ```
 2. You can set several options also during creating new logger.

    ```javascript
    const logger1 = Logger.getLogger('mymodule',  {disable: 'debug'})
    const logger2 = Logger.getLogger('mymodule',  {disable: ['debug', 'info']})
    ```
  
    Each time you `getLogger` with new configuration, it will be merged with previously defined, even though logger instance will be the same. 

 3. In very specific case you need to shut down loggers from nested npm modules that you can't affect on. One of the solutions 
 is to use [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies), but if peerDependencies is 
 not the case you can set global configuration object, that will be handled by nested logtown package.
 
     ```javascript
     _.set(global, 'logtown.namespaces.module-that-makes-mess-in-logs.disable', ['silly', 'debug']);
     ```
 
Tip: it is easy to use `easy-loader` to configure logtown for each environment.

```javascript
const config = require('../config');
const Logger = require('logtown');

Logger.configure(config('logtown', {}))
```

## License

Logtown is released under the MIT license.

## Donate

[![](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/red_rabbit)
[![](https://img.shields.io/badge/flattr-donate-yellow.svg)](https://flattr.com/profile/red_rabbit)


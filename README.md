# Logtown

> Simple Logging Facade for JavaScript.

[![npm version](https://badge.fury.io/js/logtown.svg)](https://www.npmjs.com/package/logtown)
[![Known Vulnerabilities](https://snyk.io/test/github/logtown/logtown/badge.svg)](https://snyk.io/test/github/logtown/logtown)
[![Package Quality](http://npm.packagequality.com/shield/logtown.svg)](http://packagequality.com/#?package=logtown)
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

First of all you should notice, that `logtown` is not a *logger*. You can use any logger you want underneath, there are a 
lot of great tools like intel, winston and others.
And if you don't define any wrappers you won't see any output. There are 2 ready for use wrappers contained in the 
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
// if you prefer factory method then you can use getLogger as:
// const logger = require('logtown')('my-namespace');
// or 
// const logger = Logger('my-namespace');

logger.silly('Silly message');
logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warn message');
logger.error('Error message');
```

### Using in es5 environment

There are several precompiled versions of this module placed in folders `es5` and `es6`. You might select the one you
needed by importing `require('logtown/es5/common')` for old commonjs environments.
 
### Adding new wrapper

Adding wrapper as you noticed before in the example, pretty simple operation. You required to implement at least one 
method or pass single `function` that will work like the most advanced wrapper's function `log`.

Example,
```javascript
const Logger = require('logtown');

// passing function as wrapper
Logger.addWrapper(function (id, level, stats, ...rest) {
    console.log(`${level} [${id}]`, ...rest);
});

// the same as above
Logger.addWrapper({
    log: function (id, level, stats, ...rest) {
      console.log(`${level} [${id}]`, ...rest);    
    }
});

// pass only one function for required level
Logger.addWrapper({
    info: function (id, stats, ...rest) {
        // log only info messages in this wrapper
        console.info(...rest);
    }
});

class AdvancedWrapper {
    constructor(options = {}) {
        this.supperLogger = new SupperLogger(options);
        // preparing supper logger ...
    }
    log(id, level, stats, ...rest) {
        this.supperLogger.log(...rest);
    }
}
Logger.addWrapper(new AdvancedWrapper({option1: "value"}));
```

## Configuration

Logtown can be configured in 3 ways: 
 
 * by defining application level configurations
 * by defining logger level configurations
 * and by defining global level configurations


 1. Application level is made by using `Logger.configure({})` static method.

    ```javascript
    const logger = Logger.configure({
      namespaces: {'mymodule': {disable: ['debug']}}, // disable one or more level for specific namespace
      useGlobal: false, // disable usage of global configurations, it is enabled by default
      disable: ['info', 'warn'] // disable globaly specific levels
    });
    ```
    
 2. You can set several options also during creation of the new logger.

    ```javascript
    const logger1 = Logger.getLogger('mymodule',  {disable: 'debug'})
    const logger2 = Logger.getLogger('mymodule',  {disable: ['debug', 'info']})
    ```
  
    Each time you `getLogger` with new configuration, it will be merged with previously defined ones, 
    even though logger instance will be the same. 

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

## Experimental feature

By default you are limited with defined method set. It gives possibility to rely on logger api anytime and be ready to
swap out it when needed. But sometimes you would need to use your logger's very specific functionality. For example,
`console.group`. There are 2 ways of using it - by direct calling console.group method, that is bad and in some level 
unstable. And second one, to notify somehow your wrapper.

So `logtown` introduces `send` method. That is behaves the same as other methods, but gives possibility to pass `level`.

```javascript
Logger.addWrapper({
    group: function (id, stats, ...rest) {
        console.group(id);
    },
    groupend: function(id, stats, ...rest) {
        console.groupEnd(id);
    }
});

const logger = Logger.getLogger('my-namespace');
logger.send('group');
logger.debug('Hello World');
logger.send('groupend');
```

Important to note that `send` method won't fallback to `log` method if it exists in wrapper.

## Introducing plugin API

For instance, you want to add debugging info during testing. Let's say you want to log filename:linenumber with your
favourite winston logger. But you can't([#200](https://github.com/winstonjs/winston/issues/200)). So one of the solutions 
would be to switch to [tracer](https://github.com/baryon/tracer), or just add right plugin for your logtown configuration.

```javascript
const Logger = require('logtown');

const pluginFactoryFn = require('logtown/es6/common/plugins/stacktrace');
Logger.addPlugin(pluginFactoryFn({prependRest: true}));
```

And that's it, now debug stats are available in all your wrappers. 

## Tags

```javascript
const logger = Logger.getLogger('my-namespace', {tags: ['debug', 'lib-1', 'lib-2']});

Logger.configure({tags: { disable: ['lib-1'] }});
```

## More articles

 - https://medium.com/@dzelenetskiy/confident-logging-in-nodejs-and-browser-cb97d91e673d

## License

Logtown is released under the MIT license.

## Donate

[![](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/red_rabbit)
[![](https://img.shields.io/badge/flattr-donate-yellow.svg)](https://flattr.com/profile/red_rabbit)


# logtown-sentry-browser

> Logtown wrapper for sentry logger in browser 

## Installation

```bash
yarn add logtown-sentry-browser raven-js
```

or 

```bash
npm install logtown-sentry-browser raven-js
```

## Usage

```es6
import logtown from 'logtown';
import SentryWrapper from 'logtown-sentry-browser';

logtown.addWrapper(new SentryWrapper());
```

For reference of sentry options see [sentry docs](https://docs.sentry.io/clients/javascript/)

## ES5 usage

```javascript
define(['logtown-sentry-browser/es5/umd', 'logtown/es5/umd'], function (SentryWrapper, logtown) {
    logtown.addWrapper(new SentryWrapper());
});
```

## License

Logtown-sentry-browser is released under the MIT license.

## Donate

[![](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/red_rabbit)
[![](https://img.shields.io/badge/flattr-donate-yellow.svg)](https://flattr.com/profile/red_rabbit)


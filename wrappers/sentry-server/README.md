# logtown-sentry-server

> Logtown wrapper for sentry logger on server side 

## Installation

```bash
yarn add logtown-sentry-server raven
```

or 

```bash
npm install logtown-sentry-server raven
```

## Usage

```javascript
const logtown = require('logtown');
const SentryWrapper  = require('logtown-sentry-server');

logtown.addWrapper(new SentryWrapper('https://<key>:<secret>@sentry.io/<project>'));

const logger = logtown.getLogger('my-namespace');
logger.warn('Hello Sentry');
logger.error(new Error('Caution there is an error!'));
```

For reference of sentry options see [sentry docs](https://docs.sentry.io/clients/node/)

## ES5 usage

```javascript
var SentryWrapper = require('logtown-sentry-server/es5');
```

## License

Logtown-sentry-server is released under the MIT license.

## Donate

[![](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/red_rabbit)
[![](https://img.shields.io/badge/flattr-donate-yellow.svg)](https://flattr.com/profile/red_rabbit)


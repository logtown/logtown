# logtown-logdna

> Logtown wrapper for logdna.com 

## Installation

```bash
yarn add logtown-logdna logdna
```

or 

```bash
npm install logtown-logdna logdna
```

## Usage

```javascript
const logtown = require('logtown');
const LogdnaWrapper  = require('logtown-logdna');

logtown.addWrapper(new LogdnaWrapper());

const logger = logtown.getLogger('my-namespace');
logger.debug('debug me');
```

## ES5 usage

```javascript
var LogdnaWrapper = require('logtown-logdna/es5');
```

## License

logtown-logdna is released under the MIT license.

## Donate

[![](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/red_rabbit)
[![](https://img.shields.io/badge/flattr-donate-yellow.svg)](https://flattr.com/profile/red_rabbit)


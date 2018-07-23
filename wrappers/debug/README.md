# logtown-debug

> Logtown wrapper for tj's debug tool 

## Installation

```bash
yarn add logtown-debug debug
```

or 

```bash
npm install logtown-debug debug
```

## Usage

```javascript
const logtown = require('logtown');
const DebugWrapper  = require('logtown-debug');

logtown.addWrapper(new DebugWrapper());

const logger = logtown.getLogger('my-namespace');
logger.debug('debug me');
```

## ES5 usage

```javascript
var DebugWrapper = require('logtown-debug/es5');
```

## License

logtown-debug is released under the MIT license.

## Donate

[![](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/red_rabbit)
[![](https://img.shields.io/badge/flattr-donate-yellow.svg)](https://flattr.com/profile/red_rabbit)


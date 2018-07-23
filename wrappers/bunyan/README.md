# logtown-bunyan

> Logtown wrapper for bunyan logger

## Installation

```bash
yarn add logtown-bunyan bunyan
```

or 

```bash
npm install logtown-bunyan bunyan
```

## Usage

```javascript
const logtown = require('logtown');
const BunyanWrapper  = require('logtown-bunyan');

logtown.addWrapper(new BunyanWrapper());
```

For reference of bunyan options see [bunyan docs](https://github.com/trentm/node-bunyan)

## ES5 usage

```javascript
var BunyanWrapper = require('logtown-bunyan/es5');
```

## License

logtown-bunyan is released under the MIT license.

## Donate

[![](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/red_rabbit)
[![](https://img.shields.io/badge/flattr-donate-yellow.svg)](https://flattr.com/profile/red_rabbit)


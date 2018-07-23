# logtown-winston

> Logtown wrapper for winston logger 

## Installation

```bash
yarn add logtown-winston winston 
```

or 

```bash
npm install logtown-winston winston
```

## Usage

```javascript
const logtown = require('logtown');
const WinstonWrapper = require('logtown-winston');
const winston = require('winston');

const customTransportsArray = [
    new winston.transports.Console({
      json: false,
      colorize: true,
      prettyPrint: true,
      timestamp: true,
      handleExceptions: true,
      align: false,
      level: 'silly'
    })
];

const customWinstonOptions = {exitOnError: false};

logtown.addWrapper(new WinstonWrapper(customTransportsArray, customWinstonOptions));
```

For reference of winston options see [winston docs](https://github.com/winstonjs/winston)

## ES5 usage

```javascript
var WinstonWrapper = require('logtown-winston/es5');
```

## License

Logtown-winston is released under the MIT license.

## Donate

[![](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/red_rabbit)
[![](https://img.shields.io/badge/flattr-donate-yellow.svg)](https://flattr.com/profile/red_rabbit)


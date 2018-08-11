# logtown-plugin-dumper-js

> Logtown plugin leveraging dumper.js library 

## Installation

```bash
yarn add logtown-plugin-dumper-js 
```

or 

```bash
npm install logtown-plugin-dumper-js
```

## Usage

```javascript
const logtown = require('logtown');
const dumperjs = require('logtown-plugin-dumper-js');
const Winston = require('logtown-winston3');

logtown.addPlugin(dumperjs());
logtown.addWrapper(new Winston());

const logger = logtown.getLogger('happy-logging');
logger.info([
  { user: 'barney', age: 36, active: true, createdAt: new Date(), getAge: () => this.age },
  { user: 'fred', age: 40, active: false, createdAt: new Date(), getAge: () => this.age },
  { user: 'pebbles', age: 1, active: true, createdAt: new Date(), getAge: () => this.age }
]);
```

For reference of dumper.js usage see [dumper.js docs](https://github.com/zeeshanu/dumper.js)


## License

logtown-plugin-dumper-js is released under the MIT license.

## Donate

[![](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/red_rabbit)
[![](https://img.shields.io/badge/flattr-donate-yellow.svg)](https://flattr.com/profile/red_rabbit)


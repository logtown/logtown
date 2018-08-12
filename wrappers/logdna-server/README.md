# logtown-logdna-server

> Logtown wrapper for logdna.com 

## Installation

```bash
yarn add logtown-logdna-server logdna
```

or 

```bash
npm install logtown-logdna-server logdna
```

## Usage

```javascript
const logtown = require('logtown');
const LogdnaWrapper  = require('logtown-logdna');

logtown.addWrapper(new LogdnaWrapper({ ip: '192.168.1.1' }));

const logger = logtown.getLogger('my-namespace');
logger.debug('debug me');
```

## License

logtown-logdna-server is released under the MIT license.

## Donate

[![](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/red_rabbit)
[![](https://img.shields.io/badge/flattr-donate-yellow.svg)](https://flattr.com/profile/red_rabbit)


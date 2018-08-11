# logtown-plugin-pretty-error

> Logtown plugin leveraging pretty-error 

## Installation

```bash
yarn add logtown-plugin-pretty-error 
```

or 

```bash
npm install logtown-plugin-pretty-error
```

## Usage

```javascript
const logtown = require('logtown');
const prettyError = require('logtown-plugin-pretty-error');
const Winston = require('logtown-winston3');

logtown.addPlugin(prettyError({}));
logtown.addWrapper(new Winston());

const logger = logtown.getLogger('happy-logging');
logger.error(new Error('Hello World'));
```

For reference of pretty-error usage see [pretty-error docs](https://github.com/AriaMinaei/pretty-error)


## License

logtown-plugin-pretty-error is released under the MIT license.

## Donate

[![](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/red_rabbit)
[![](https://img.shields.io/badge/flattr-donate-yellow.svg)](https://flattr.com/profile/red_rabbit)


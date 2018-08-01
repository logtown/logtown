# koa-logtown

> Development style logger middleware for Koa that leverages logtown.

The middleware is very similar to `koa-logger`, but `console.log` was replaced with `logtown` functions calls.

```
<-- GET /
--> GET / 200 835ms 746b
<-- GET /
--> GET / 200 960ms 1.9kb
<-- GET /users
--> GET /users 200 357ms 922b
<-- GET /users?page=2
--> GET /users?page=2 200 466ms 4.66kb
```

## Installation

```bash
npm install koa-logtown logtown --save
```

or 

```bash
yarn add koa-logtown logtown
```

## Usage

```javascript
const koaLogger = require('koa-logtown');
const Koa = require('koa');

const app = new Koa();
app.use(koaLogger());
```

## License

koa-logtown is released under the MIT license.

## Donate

[![](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/red_rabbit)
[![](https://img.shields.io/badge/flattr-donate-yellow.svg)](https://flattr.com/profile/red_rabbit)

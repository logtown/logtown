# Router5 logtown plugin

[![npm version](https://badge.fury.io/js/router5-logtown-plugin.svg)](https://www.npmjs.com/package/router5-logtown-plugin)
[![dependencies:?](https://img.shields.io/david/zemd/router5-logtown-plugin.svg)](https://david-dm.org/zemd/router5-logtown-plugin)
[![devDependencies:?](https://img.shields.io/david/dev/zemd/router5-logtown-plugin.svg?style=flat)](https://david-dm.org/zemd/router5-logtown-plugin)

## Installation

```bash
npm install router5-logtown-plugin --save
```

or 

```bash
yarn add router5-logtown-plugin
```

## Usage

```javascript
import logtownPlugin from 'router5-logtown-plugin';

const routes = [];
const router = createRouter(routes, {
        defaultRoute: 'home'
    })
    // Plugins
    .usePlugin(logtownPlugin());
```

## License

router5-logtown-plugin is released under the MIT license.

## Donate

[![](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/red_rabbit)
[![](https://img.shields.io/badge/flattr-donate-yellow.svg)](https://flattr.com/profile/red_rabbit)

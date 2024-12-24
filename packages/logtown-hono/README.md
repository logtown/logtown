# Hono middleware for logging using `logtown`

[![npm](https://img.shields.io/npm/v/@logtown/hono?color=0000ff&label=npm&labelColor=000)](https://npmjs.com/package/@logtown/hono)

## Installation

```bash
npm install @logtown/hono
yarn add @logtown/hono
pnpm add @logtown/hono
bun add @logtown/hono
```

## Usage

```typescript
import { SimpleConsoleWrapper } from "logtown";
import { loggerHttp } from "@logtown/hono";
import { Hono } from "hono";
import { getConnInfo } from "@hono/node-server/conninfo";
import { serve, type HttpBindings } from "@hono/node-server";

registerWrapper(SimpleConsoleWrapper);

const app = new Hono();

app.use(
  "*",
  loggerHttp({
    format: process.env.NODE_ENV === "development" ? "short" : "apache-common",
    getConnInfo,
    transformers: {
      "http-version": (context) => {
        const bindings = (context.env.server ? context.env.server : context.env) as HttpBindings;
        return bindings.incoming.httpVersion;
      },
    },
  }),
);

serve({
  fetch: app.fetch,
  port: 3000,
});
```

> [!NOTE]
> `loggerHttp` middleware does not colorize output, just a simple formatting according to the provided format. However, if you want to colorize the output, you can configure this within the Logtown Wrapper. The `loggerHttp` provides all the fields from the formatted string as an object.

## License

`@logtown/hono` released under the Apache 2.0 license

## Donate

[![](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/red_rabbit)
[![](https://img.shields.io/static/v1?label=UNITED24&message=support%20Ukraine&color=blue)](https://u24.gov.ua/)

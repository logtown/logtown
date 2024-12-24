# Logtown

[![npm](https://img.shields.io/npm/v/logtown?color=0000ff&label=npm&labelColor=000)](https://npmjs.com/package/logtown)

Lightweight logging wrapper with only one dependency. Logtown is not a logger and does not depend on any loggers.

The reasoning behind this package is to provide a simple and easy-to-use logging interface that can be used with any logger within any environment.

Nowadays, application can be run in many different environments, such as Cloudflare Workers, Deno, AWS Lambda, Node.js, Bun.js, Browsers and many others. Each of these environments has its own logging capabilities and requirements. **Logtown** is designed to be a single logging interface that can be used in any of these environments.

For example, for local development you can enable console logging that would include colors, while in production you would use a logger that sends logs to a remote server, such as AWS CloudWatch, and/or you can configure it to send logs in a specific format, like JSON.

## Log levels

Logtown supports the following log levels:

- `verbose`
- `debug`
- `info`
- `warn`
- `error`

No other log levels are supported and never will be. The decision to keep the number of log levels to a minimum and never change them, so that the code that uses Logtown will be more predictable and easier to maintain.

## Installation

```bash
npm install logtown
yarn add logtown
pnpm add logtown
bun add logtown
```

## Usage

```typescript
import { createLogger, registerWrapper, ConsoleWrapper } from "logtown";

const logger = new createLogger("my-logger");
logger.info("Hello World");
// ^ nothing happens, because no wrappers were added

registerWrapper(ConsoleWrapper);
logger.info("Hello World");
// ^ prints "Hello World" to the console
```

## Wrappers

Wrappers are the actual loggers that will be used to log messages. You should create your own wrapper. The wrapper can be either a function or an object that has a `log` method(that would be called for all log levels) or any of log level methods.

```typescript
import { createLogger, registerWrapper, type LoggerPayload } from "logtown";

// the following wrapper will log all messages to the console
registerWrapper({
  log: ({ level, message }: LoggerPayload) => {
    console.log(`[${level}] ${message}`);
  },
});
```

```typescript
import { createLogger, registerWrapper, type LoggerPayload } from "logtown";
import debug from "debug";
const debugLog = debug("my-logger");

if (process.env.NODE_ENV === "development") {
  // the following wrapper will log debug messages only to the debug logger
  registerWrapper({
    debug: ({ level, timestamp, id, message, ...rest }: LoggerPayload) => {
      debugLog(message, ...rest);
    },
  });
}
```

## License

`logtown` released under the Apache 2.0 license

## Donate

[![](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/red_rabbit)
[![](https://img.shields.io/static/v1?label=UNITED24&message=support%20Ukraine&color=blue)](https://u24.gov.ua/)

import type { LoggerWrapper } from "../index.js";

export const ConsoleWrapper: LoggerWrapper = {
  debug: (payload) => {
    console.debug(payload);
  },
  error: (payload) => {
    console.error(payload);
  },
  info: (payload) => {
    console.info(payload);
  },
  warn: (payload) => {
    console.warn(payload);
  },
  verbose: (payload) => {
    console.log(payload);
  },
};

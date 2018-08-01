"use strict";

const logger = require("logtown")("koa-logtown");

const Counter = require("passthrough-counter");
const humanize = require("humanize-number");
const bytes = require("bytes");
const chalk = require("chalk");

module.exports = () => {
  return async (ctx, next) => {
    // request
    const start = Date.now();
    logger.debug(`${chalk.gray("<--")} ${chalk.bold(ctx.method)} ${chalk.gray(ctx.originalUrl)}`);

    try {
      await next();
    } catch (err) {
      // log uncaught downstream errors
      log(ctx, start, null, err);
      throw err;
    }

    // calculate the length of a streaming response
    // by intercepting the stream with a counter.
    // only necessary if a content-length header is currently not set.
    const length = ctx.response.length;
    const body = ctx.body;
    let counter;
    if (null == length && body && body.readable) {
      ctx.body = body
        .pipe(counter = Counter())
        .on("error", ctx.onerror);
    }

    // log when the response is finished or ended,
    // whichever happens first.
    const res = ctx.res;

    const onfinish = done.bind(null, "finish");
    const onclose = done.bind(null, "close");

    res.once("finish", onfinish);
    res.once("close", onclose);

    function done(event) {
      res.removeListener("finish", onfinish);
      res.removeListener("close", onclose);
      log(ctx, start, counter ? counter.length : length, null, event);
    }
  }
};

/**
 * Color map.
 */
const colorCodes = {
  5: "red",
  4: "yellow",
  3: "cyan",
  2: "green",
  1: "green"
};

/**
 * Log helper.
 */
function log(ctx, start, len, err, event) {
  // get the status code of the response
  const status = err ? (err.status || 500) : (ctx.status || 404);

  // set the color of the status code;
  const s = status / 100 | 0;
  const color = colorCodes[s];

  // get the human readable response length
  let length;
  if (~[204, 205, 304].indexOf(status)) {
    length = "";
  } else if (null == len) {
    length = "-";
  } else {
    length = bytes(len);
  }

  const upstream = err ? chalk.red("xxx")
    : event === "end" ? chalk.yellow("-x-")
      : chalk.gray("-->");

  logger.debug(`${upstream} ${chalk.bold(ctx.method)} ${chalk.gray(ctx.originalUrl)} ${chalk[color](status)} ${chalk.gray(time(start))} ${chalk.gray(length)}`);
}

/**
 * Show the response time in a human readable format.
 * In milliseconds if less than 10 seconds,
 * in seconds otherwise.
 */
function time(start) {
  const delta = Date.now() - start;
  return humanize(delta < 10000
    ? delta + "ms"
    : Math.round(delta / 1000) + "s");
}

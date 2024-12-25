import type { MiddlewareHandler, Context as HonoContext } from "hono";
import { createLogger } from "logtown";
import type { ConnInfo, GetConnInfo } from "hono/conninfo";

const logger = createLogger("http");

const FORMAT_NAMES = ["apache-combined", "apache-common", "dev", "short", "tiny"] as const;
type FormatName = (typeof FORMAT_NAMES)[number];

const FORMATS: Record<FormatName, string> = {
  "apache-combined": `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :content-length ":referrer" ":user-agent"`,
  "apache-common": `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :content-length`,
  dev: `:method :url :status :response-time - :content-length`,
  short: `:remote-addr :remote-user :method :url HTTP/:http-version :status :content-length - :response-time`,
  tiny: `:method :url :status :content-length - :response-time`,
};

type LoggerHttpOptions = {
  format: FormatName | (string & {});
  getConnInfo: GetConnInfo;
  transformers: Partial<Record<SupportedTransformers, TransformerFn>>;
};

const SUPPORTED_TRANSFORMER = [
  "remote-addr",
  "remote-user",
  "date",
  "method",
  "url",
  "http-version",
  "status",
  "content-length",
  "referrer",
  "user-agent",
  "response-time",
] as const;
type SupportedTransformers = (typeof SUPPORTED_TRANSFORMER)[number];
type TransformerInfo = {
  connInfo?: ConnInfo;
  stage: "before" | "after";
  [k: string]: any;
};
type TransformerFn = <ArgContext extends HonoContext>(
  context: ArgContext,
  info: TransformerInfo,
  ...rest: any[]
) => string;

const pad2 = (str: string | number) => {
  return `${`${str}`.length === 1 ? "0" : ""}${str}`;
};

const CLF_MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

// Information that is retrieved from the request MUST be replaced with "-" when is not available
// Information that is retrieved from the response MUST be replaced with ""(empty string) when is not available
const transformers: Partial<Record<SupportedTransformers, TransformerFn>> = {
  "remote-addr": (_context, info) => info.connInfo?.remote.address ?? "-",
  method: (context) => context.req.method,
  url: (context) => decodeURI(context.req.raw.url),
  referrer: (context) => context.req.header("referer") ?? context.req.header("referrer") ?? "-",
  "user-agent": (context) => context.req.header("user-agent") ?? "-",
  status: (context, executionInfo) => {
    if (executionInfo.stage === "after") {
      return `${context.res.status}`;
    }
    return "";
  },
  "content-length": (context, info) => {
    if (info.stage === "after") {
      return `${context.res.headers.get("Content-Length") ?? "0"}`;
    }
    return "";
  },
  date: (_, _info, dateFmt = "web") => {
    const now = new Date();
    switch (dateFmt) {
      case "clf": {
        const date = now.getUTCDate();
        const hour = now.getUTCHours();
        const mins = now.getUTCMinutes();
        const secs = now.getUTCSeconds();
        const year = now.getUTCFullYear();
        const month = CLF_MONTH[now.getUTCMonth()];

        return `${pad2(date)}/${month}/${year}:${pad2(hour)}:${pad2(mins)}:${pad2(secs)} +0000`;
      }
      case "iso": {
        return now.toISOString();
      }
      default:
      case "web": {
        return now.toUTCString();
      }
    }
  },
  "response-time": (_, info) => {
    const now = performance.now();
    if (info.startAt && info.stage === "after") {
      // calculate diff
      const delta = now - info.startAt;

      // return truncated value
      return `${delta.toFixed(3)}ms`;
    }

    return "";
  },
  "remote-user": () => "-", // use `basic-auth` package for parsing authorization header with Basic Auth credentials
  "http-version": () => "-",
};

const trimLogMessage = (message: string) => {
  let result = message.trim();

  while (result.startsWith("-")) {
    result = result.slice(1);
  }

  while (result.endsWith("-")) {
    result = result.slice(0, -1);
  }

  result = result.replace(/\s+/g, " ");
  return result;
};

// inspired by expressjs/morgan
const compile = (format: string) => {
  const keys: string[] = [];
  const code = format.replace(/:([-\w]{2,})(?:\[([^\]]+)\])?/g, (_, key, arg) => {
    keys.push(
      `${JSON.stringify(key)}: transformers?.[${JSON.stringify(key)}]?.(context, info, ${JSON.stringify(arg)}) ?? ""`,
    );
    return `\${transformers?.[${JSON.stringify(key)}]?.(context, info, ${JSON.stringify(arg)}) ?? ""}`;
  });
  const func = new Function(
    "transformers, context, info",
    `"use strict"; return { message: \`${code}\`, ${keys.join(",")} }`,
  );
  return (
    transformers: Partial<Record<SupportedTransformers, TransformerFn>>,
    ...params: Parameters<TransformerFn>
  ) => {
    const [context, info] = params;
    const res = func(transformers, context, info);
    res.message = trimLogMessage(res.message);
    return res;
  };
};

export const loggerHttp = ({
  format,
  getConnInfo,
  transformers: customTransformers,
}: Partial<LoggerHttpOptions> = {}): MiddlewareHandler => {
  if (customTransformers) {
    Object.assign(transformers, customTransformers);
  }

  const fmt = FORMATS[format as FormatName] ?? format ?? FORMATS["apache-combined"];
  const compiled = compile(fmt);

  return async (context, next) => {
    const connInfo = getConnInfo?.(context);
    const startAt = performance.now();

    const incommingMessage = compiled(transformers, context, {
      connInfo,
      stage: "before",
      startAt,
    });
    logger.info(incommingMessage);

    await next();

    const outgoingMessage = compiled(transformers, context, { connInfo, stage: "after", startAt });
    logger.info(outgoingMessage);
  };
};

export default loggerHttp;

import { printf as format } from "fast-printf";

// Thanks to "Typed Rocks" for the help with the types
type BaseTypes = string | number | object | bigint | boolean | symbol | null | undefined;
type Mapping = {
  [Key in "d" | "i" | "f"]: number;
} & { s: string } & { [Key in "o" | "O"]: object };

type AddMappedToArray<ArgsArray extends any[], Char> = Char extends keyof Mapping
  ? [...ArgsArray, Mapping[Char]]
  : ArgsArray;

type FirstChar<T extends string> = T extends `${infer Head}${string}` ? Head : T;
type ArgsFromPlaceholder<
  RemainingString extends string,
  ArgsArray extends any[] = [],
> = RemainingString extends `${infer Head}${infer Tail}`
  ? Head extends "%"
    ? ArgsFromPlaceholder<Tail, AddMappedToArray<ArgsArray, FirstChar<Tail>>>
    : ArgsFromPlaceholder<Tail, ArgsArray>
  : [...ArgsArray, ...args: any[]];
type OptionalParams<Input> = Input extends string ? ArgsFromPlaceholder<Input> : any[];
type LogFn = <T extends BaseTypes>(message?: T, ...optionalParams: OptionalParams<T>) => void;

export interface ILogger {
  verbose: LogFn;
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  error: LogFn;
}

export const LOG_LEVELS = ["VERBOSE", "DEBUG", "INFO", "WARN", "ERROR"] as const;
Object.freeze(LOG_LEVELS);

export type LogLevel = (typeof LOG_LEVELS)[number];
export type LoggerPayload = {
  level: LogLevel;
  message: string;
  timestamp: number;
  id: string;
  data: any[];
};

type ExcludableLogRule<TRule extends string> = TRule | `!${TRule}`;
export type LogRule =
  | ExcludableLogRule<`${string}.*`> // for example, "my-logger.*" disables all logs from "my-logger"
  | ExcludableLogRule<`${string}.${LogLevel}`> // for example, "my-logger.INFO" disables only INFO logs from "my-logger"
  | ExcludableLogRule<`*.${LogLevel}`>; // for example, "*.INFO" disables all INFO logs

type ModuleLogLevelStatus = "disabled" | "enabled";
export const LOGTOWN_RULES_SYMBOL = Symbol.for("logtown_rules");
export type LogRuleStorage = Map<string, Map<LogLevel | "*", ModuleLogLevelStatus>>;

declare global {
  interface Global {
    [LOGTOWN_RULES_SYMBOL]: LogRuleStorage;
  }
}

export type WrapperLoggerFn = (payload: LoggerPayload) => void;
type WrapperLoggerFnName = Lowercase<LogLevel> | "log";
export type WrapperLoggerObj = Partial<Record<WrapperLoggerFnName, WrapperLoggerFn> & Record<string, any>>;

const WRAPPERS: WrapperLoggerObj[] = [];
const LOGGERS = new Map<string, Logger>();

(globalThis as any)[LOGTOWN_RULES_SYMBOL] = (globalThis as any)[LOGTOWN_RULES_SYMBOL] ?? new Map();

class Logger implements ILogger {
  constructor(public readonly id: string) {}

  #log<T extends BaseTypes>(level: LogLevel, msg: T, ...optionalParams: OptionalParams<T>) {
    if (getStatus(this.id, level) === "disabled") {
      return;
    }

    const message =
      typeof msg === "string"
        ? format(msg, ...optionalParams)
        : typeof msg === "object" && msg && "message" in msg && typeof msg.message === "string"
          ? msg.message
          : `${String(msg)} ${optionalParams
              .map((p) => {
                if (p instanceof Error) {
                  return p;
                }
                return JSON.stringify(p);
              })
              .join(" ")}`;
    const data = typeof msg === "string" ? optionalParams : [msg, ...optionalParams];

    const payload: LoggerPayload = {
      data,
      id: this.id,
      level,
      message,
      timestamp: Date.now(),
    };

    const methodName = level.toLowerCase() as Lowercase<LogLevel>;
    WRAPPERS.forEach((wrapper) => {
      if (methodName in wrapper) {
        // @ts-ignore
        wrapper[methodName]?.(payload);
      } else if ("log" in wrapper) {
        wrapper.log?.(payload);
      }
    });
  }

  verbose<T extends BaseTypes>(msg: T, ...optionalParams: OptionalParams<T>) {
    this.#log("VERBOSE", msg, ...optionalParams);
  }

  debug<T extends BaseTypes>(msg: T, ...optionalParams: OptionalParams<T>) {
    this.#log("DEBUG", msg, ...optionalParams);
  }

  info<T extends BaseTypes>(msg: T, ...optionalParams: OptionalParams<T>) {
    this.#log("INFO", msg, ...optionalParams);
  }

  warn<T extends BaseTypes>(msg: T, ...optionalParams: OptionalParams<T>) {
    this.#log("WARN", msg, ...optionalParams);
  }

  error<T extends BaseTypes>(msg: T, ...optionalParams: OptionalParams<T>) {
    this.#log("ERROR", msg, ...optionalParams);
  }
}

/**
 * Creates a logger with the specified id.
 *
 * ```typescript
 * import { createLogger } from "@zemd/logtown";
 * const logger = createLogger("my-logger");
 * logger.verbose("Hello, %s!", "world");
 * ```
 */
export const createLogger = (id: string): Logger => {
  if (LOGGERS.has(id)) {
    return LOGGERS.get(id)!;
  }
  const logger = new Logger(id);
  LOGGERS.set(id, logger);
  return logger;
};

/**
 * Default logger.
 *
 * ```typescript
 * import { logger } from "@zemd/logtown";
 * logger.verbose("Hello, %s!", "world");
 * ```
 */
export const logger = createLogger("default");

/**
 * Registers a wrapper.
 *
 * ```typescript
 * import { registerWrapper } from "@zemd/logtown";
 * registerWrapper({ log: (payload) => { console.log(payload); } });
 * ```
 */
export function registerWrapper(wrapper: WrapperLoggerFn | WrapperLoggerObj): void {
  if (typeof wrapper === "function") {
    WRAPPERS.push({
      log: wrapper,
    });
  } else {
    WRAPPERS.push(wrapper);
  }
}

export const SimpleConsoleWrapper: WrapperLoggerObj = {
  debug: (payload) => {
    console.debug(payload.message);
  },
  error: (payload) => {
    console.error(payload.message);
  },
  info: (payload) => {
    console.info(payload.message);
  },
  warn: (payload) => {
    console.warn(payload.message);
  },
  verbose: (payload) => {
    console.log(payload.message);
  },
};

export const ConsoleWrapper: WrapperLoggerObj = {
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

/**
 * Configures the logger. Usually you would want to use it once in your application.
 *
 * ```typescript
 * import { disableOutput } from "@zemd/logtown";
 * disableOutput(["mymodule.*", "mymodule2.verbose", "!mymodule2.*"]);
 * ```
 */
export const disableOutput = (rules: LogRule[]) => {
  rules.forEach((rule) => {
    addRule(rule);
  });
};

export default createLogger;

function addRule(rule: LogRule): void {
  const [id, level] = rule.split(".") as [string, LogLevel | "*"];
  const pureId = id.replace("!", "").toLowerCase();

  if (!((globalThis as any)[LOGTOWN_RULES_SYMBOL] as LogRuleStorage).get(pureId)) {
    // @ts-ignore
    ((globalThis as any)[LOGTOWN_RULES_SYMBOL] as LogRuleStorage).set(pureId, new Map());
  }

  ((globalThis as any)[LOGTOWN_RULES_SYMBOL] as LogRuleStorage)
    .get(pureId)
    ?.set(level, rule.startsWith("!") ? "enabled" : "disabled");
}

function getStatus(id: string, level: LogLevel): ModuleLogLevelStatus {
  const safeId = id.toLowerCase();
  const moduleLevelRule = ((globalThis as any)[LOGTOWN_RULES_SYMBOL] as LogRuleStorage).get(safeId)?.get(level);
  const moduleWildcardRule = ((globalThis as any)[LOGTOWN_RULES_SYMBOL] as LogRuleStorage).get(safeId)?.get("*");
  const globalLevelRule = ((globalThis as any)[LOGTOWN_RULES_SYMBOL] as LogRuleStorage).get("*")?.get(level);
  const globalWildcardRule = ((globalThis as any)[LOGTOWN_RULES_SYMBOL] as LogRuleStorage).get("*")?.get("*");

  return globalLevelRule ?? globalWildcardRule ?? moduleLevelRule ?? moduleWildcardRule ?? "enabled";
}

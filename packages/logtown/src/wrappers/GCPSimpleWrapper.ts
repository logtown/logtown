import type { LoggerPayload, LoggerWrapper, LogLevel } from "../index.js";

/**
 * Consider using @google-cloud/logging for a more advanced GCP logging solution
 */
export class GCPSimpleWrapper implements LoggerWrapper {
  #payloadType: "json" | "text" | "proto";
  constructor({
    payloadType = "json",
  }: Partial<{
    payloadType: "json" | "text" | "proto";
  }> = {}) {
    this.#payloadType = payloadType;
  }
  #createLogEntry(payload: LoggerPayload) {
    const LevelToSeverity: Record<LogLevel, string> = {
      VERBOSE: "DEFAULT",
      DEBUG: "DEBUG",
      INFO: "INFO",
      WARN: "WARNING",
      ERROR: "ERROR",
    };

    const reservedKeys = [
      // "logName",
      "resource",
      // "timestamp",
      "receiveTimestamp",
      "severity",
      "insertId",
      "httpRequest",
      "labels",
      "operation",
      "trace",
      "spanId",
      "traceSampled",
      "sourceLocation",
      "split",
      "errorGroups",
      "apphub",
      "apphubDestination",
    ];

    const meta: Record<string, any> = payload.data
      .filter((d) => typeof d === "object" && d !== null && !(d instanceof Error))
      .reduce((acc, d) => {
        return Object.assign(acc, d);
      }, {});

    const metaKeys = Object.keys(meta);
    metaKeys.filter((metaKey) => {
      return !reservedKeys.includes(metaKey);
    });

    const entryOverrides = metaKeys.reduce<Record<string, any>>((acc, key) => {
      acc[key] = meta[key];
      return acc;
    }, {});

    const jsonPayloadData = metaKeys.reduce<Record<string, any>>((acc, key) => {
      if (reservedKeys.includes(key)) {
        return acc;
      }
      acc[key] = meta[key];
      return acc;
    }, {});

    if (this.#payloadType === "proto") {
      throw new Error("Proto is not supported yet.");
    }
    const entryPayload = this.#payloadType === "text" ? { textPayload: payload.message } : jsonPayloadData;

    return {
      severity: LevelToSeverity[payload.level],
      ...entryPayload,
      ...entryOverrides,
      timestamp: new Date(payload.timestamp).toISOString(),
      logName: payload.id,
    };
  }
  log(payload: LoggerPayload) {
    console.log(this.#createLogEntry(payload));
  }
  error(payload: LoggerPayload) {
    console.error(this.#createLogEntry(payload));
  }
  warn(payload: LoggerPayload) {
    console.warn(this.#createLogEntry(payload));
  }
  info(payload: LoggerPayload) {
    console.info(this.#createLogEntry(payload));
  }
}

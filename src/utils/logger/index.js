import pino from "pino";
import logLevelData from "./logLevel";

const logLevels = new Map(Object.entries(logLevelData))

export function getLogLevel(logger) {
    return logLevels.get(logger) || logLevels.get("*") || "info";
}

export function getLogger(name) {
    return pino({name, level: getLogLevel(name)});
}
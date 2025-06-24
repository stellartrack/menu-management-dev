// utils/logger.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if not exists
const LOG_DIR = path.join(__dirname, "../logs");
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Get daily log file path
const getLogFilePath = () => {
  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  return path.join(LOG_DIR, `app-${date}.log`);
};

// Generic log writer
const writeLog = (level, message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  fs.appendFileSync(getLogFilePath(), logEntry);
};

// Exported log methods
export const logInfo = (message) => writeLog("info", message);
export const logWarn = (message) => writeLog("warn", message);
export const logError = (error) => {
  const errMsg = error instanceof Error ? error.stack || error.message : error;
  writeLog("error", errMsg);
};

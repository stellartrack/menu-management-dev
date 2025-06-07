const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../logs/error.log");

const logError = (err) => {
  const errorMsg = `[${new Date().toISOString()}] ${err.stack || err}\n`;
  fs.appendFile(logFilePath, errorMsg, (writeErr) => {
    if (writeErr) console.error("Error writing to log file:", writeErr);
  });
};

module.exports = { logError };
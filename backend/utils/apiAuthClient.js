const axios = require("axios");
const fs = require("fs");
const path = require("path");

const LOG_DIR = path.join(__dirname, "../logs");
const LOG_FILE = path.join(LOG_DIR, "api.log");

// Ensure the logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

const apiAuthClient = axios.create({
  baseURL: process.env.LARAVEL_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Helper: Append to log file
function logToFile(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logMessage);
}

// Request Interceptor
apiAuthClient.interceptors.request.use(
  (config) => {
    const log = [
      "📤 [API Request]",
      `URL: ${config.baseURL + config.url}`,
      `Method: ${config.method.toUpperCase()}`,
      `Headers: ${JSON.stringify(config.headers)}`,
      config.data ? `Body: ${JSON.stringify(config.data)}` : null,
    ].filter(Boolean).join("\n");

    logToFile(log);
    return config;
  },
  (error) => {
    const log = `❌ [API Request Error] ${error.message}`;
    logToFile(log);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiAuthClient.interceptors.response.use(
  (response) => {
    const log = [
      "📥 [API Response]",
      `URL: ${response.config.baseURL + response.config.url}`,
      `Status: ${response.status}`,
      `Data: ${JSON.stringify(response.data)}`
    ].join("\n");

    console.log(log);
    logToFile(log);
    return response;
  },
  (error) => {
    const errMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    const log = `❌ [API Response Error] ${errMsg}`;
    logToFile(log);
    return Promise.reject(error);
  }
);

module.exports = apiAuthClient;

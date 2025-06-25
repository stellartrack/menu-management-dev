// utils/apiClient.js
import axios from "axios";
import { logInfo, logError } from "./logger.js";
import { SBS_API_URL, LARAVEL_API_URL } from "../config/env.js";

// Create custom axios instance
const createApiClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
  });

  // Request logging
  client.interceptors.request.use(
    (config) => {
      const log = [
        "📤 [API Request]",
        `URL: ${config.baseURL + config.url}`,
        `Method: ${config.method.toUpperCase()}`,
        `Headers: ${JSON.stringify(config.headers)}`,
        config.data ? `Body: ${JSON.stringify(config.data)}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      logInfo(log);
      return config;
    },
    (error) => {
      logError(`❌ [API Request Error] ${error.message}`);
      return Promise.reject(error);
    }
  );

  // Response logging
  client.interceptors.response.use(
    (response) => {
      const log = [
        "📥 [API Response]",
        `URL: ${response.config.baseURL + response.config.url}`,
        `Status: ${response.status}`,
        `Data: ${JSON.stringify(response.data)}`,
      ].join("\n");

      logInfo(log);
      return response;
    },
    (error) => {
      const errMsg = error.response
        ? JSON.stringify(error.response.data)
        : error.message;
      logError(`❌ [API Response Error] ${errMsg}`);
      return Promise.reject(error);
    }
  );

  return client;
};

const apiClient = createApiClient(SBS_API_URL);
const authApiClient = createApiClient(LARAVEL_API_URL);

export { apiClient, authApiClient };
export default apiClient;

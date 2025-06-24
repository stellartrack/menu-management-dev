// utils/apiClientRegistry.js
import { apiClient, authApiClient } from "./apiClient.js";

const clientRegistry = {
  default: apiClient,
  auth: authApiClient,
};

export const getApiClient = (type = "default") => {
  const client = clientRegistry[type];
  if (!client) throw new Error(`Unknown API client type: ${type}`);
  return client;
};

// services/factory/baseServiceFactory.js

/**
 * Creates a generic base service with standard and custom operations
 * @param {AxiosInstance} client - The axios client instance to use
 * @param {Object} endpoints - Optional mapping of endpoint routes for common actions
 * @param {Object} custom - Optional custom methods (functions receiving client and args)
 * @returns {Object} - A service object with attached API methods
 */
export const createBaseService = (client, endpoints = {}, custom = {}) => {
  const service = {};

  // Just directly assign the passed-in functions (they already wrap client)
  for (const [name, fn] of Object.entries(endpoints)) {
    service[name] = fn;
  }

  for (const [name, fn] of Object.entries(custom)) {
    service[name] = (...args) => fn(client, ...args);
  }

  return service;
};

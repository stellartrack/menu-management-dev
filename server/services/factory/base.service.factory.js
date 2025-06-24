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

  // Standard CRUD-like operations
  if (endpoints.create) {
    service.create = (payload) => client.post(endpoints.create, payload);
  }

  if (endpoints.update) {
    service.update = (payload) => client.put(endpoints.update, payload);
  }

  if (endpoints.delete) {
    service.delete = (payload) => client.post(endpoints.delete, payload);
  }

  if (endpoints.getAll) {
    service.getAll = (params) => client.get(endpoints.getAll, { params });
  }

  if (endpoints.getById) {
    service.getById = (id) => client.get(`${endpoints.getById}/${id}`);
  }

  // Register custom functions (e.g., complex or nested API calls)
  for (const [name, fn] of Object.entries(custom)) {
    service[name] = (...args) => fn(client, ...args);
  }

  return service;
};

// services/role.service.js

import { getApiClient } from "../utils/apiClientRegistry.js";
import * as roleApi from "../apis/role.api.js";
import { createBaseService } from "./factory/base.service.factory.js";

const client = getApiClient("default");

const base = createBaseService(client, {
  create: (payload) => roleApi.create(client, payload),
  update: (payload) => roleApi.update(client, payload),
  delete: (payload) => roleApi.remove(client, payload),
});

export const RoleService = {
  ...base,
  getGlobal: (params) => roleApi.fetchGlobal(client, params),
  getCompany: (params) => roleApi.fetchCompany(client, params),
};

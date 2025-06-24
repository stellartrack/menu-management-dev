// services/role.service.js

import { getApiClient } from "../utils/apiClientRegistry.js";
import * as roleApi from "../apis/role.api.js";
import { createBaseService } from "./factory/base.service.factory.js";

const client = getApiClient("default");

export const RoleService = createBaseService(client, {}, {
  create: roleApi.create,
  update: roleApi.update,
  delete: roleApi.remove,
  fetchGlobal: roleApi.fetchGlobal,
  fetchCompany: roleApi.fetchCompany,
});

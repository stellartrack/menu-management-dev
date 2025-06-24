import { getApiClient } from "../utils/apiClientRegistry.js";
import * as authApi from "../apis/auth.api.js";
import { createBaseService } from "./factory/base.service.factory.js";

const client = getApiClient("auth");

export const AuthService = createBaseService(client, {}, {
  checkExpiry: authApi.checkTokenExpiry,
  refresh: authApi.refreshToken,
});

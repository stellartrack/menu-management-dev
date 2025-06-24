// services/menu.service.js
import { getApiClient } from "../utils/apiClientRegistry.js";
import * as menuApi from "../apis/menu.api.js";
import { createBaseService } from "./factory/base.service.factory.js";
export const MenuService = createBaseService(getApiClient("default"), {}, menuApi);

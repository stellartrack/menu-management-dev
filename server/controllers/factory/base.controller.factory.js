// factory/base.controller.factory.js

import { successResponse, errorResponse } from "../../helpers/response.helper.js";
import { handleControllerError } from "../../helpers/errorHandler.helper.js";
import { MESSAGES } from "../../constants/messages.js";

/**
 * Base controller factory with support for dynamic payload building.
 * @param {Object} service - The service layer
 * @param {Object} config
 * @param {Object} config.messages - Message mappings
 * @param {Object} config.aliases - Method name aliases
 * @param {Function} config.responseHandler - Custom response function
 * @param {Function} config.errorHandler - Custom error handler
 * @param {Function} config.buildPayload - Function to build payload from `req`
 */
export const createBaseController = (service, config = {}) => {
  const {
    messages = MESSAGES.DEFAULT,
    aliases = {},
    responseHandler = successResponse,
    errorHandler = handleControllerError,
    buildPayload = (req) => ({ ...req.body }),
  } = config;

  const resolveMethod = (type, fallback) => {
    const method = service[aliases[type] || fallback];
    if (typeof method !== "function") {
      console.warn(`⚠️  Controller function type for "${type}" is not a function.`);
    }
    return method;
  };

  return {
    // 🔁 CREATE or UPSERT
    create: async (req, res) => {
      try {
        const payload = buildPayload(req);
        const result = await resolveMethod("create", "create")(payload);
        const isUpdate = !!req.body.menuID; // optional flag logic

        if (result?.data?.result === 1) {
          return responseHandler(
            res,
            isUpdate ? messages.UPDATED : messages.CREATED,
            result.data,
            isUpdate ? 200 : 201
          );
        }

        return errorResponse(res, messages.FAILED, 400, result?.data?.errors || []);
      } catch (err) {
        return errorHandler(res, err);
      }
    },

    // 📄 READ
    get: async (req, res) => {
      try {
        const result = await resolveMethod("get", "getAll")(req.query);
        return result?.data
          ? responseHandler(res, messages.FETCHED, result.data)
          : errorResponse(res, messages.NOT_FOUND, 404);
      } catch (err) {
        return errorHandler(res, err);
      }
    },

    // ✏️ UPDATE
    update: async (req, res) => {
      try {
        const payload = buildPayload(req);
        const result = await resolveMethod("update", "update")(payload);

        if (result?.data?.result === 1) {
          return responseHandler(res, messages.UPDATED, result.data);
        }

        return errorResponse(res, messages.FAILED, 400, result?.data?.errors || []);
      } catch (err) {
        return errorHandler(res, err);
      }
    },

    // ❌ DELETE
    remove: async (req, res) => {
      try {
        const payload = buildPayload(req);
        const result = await resolveMethod("remove", "delete")(payload);

        if (result?.data?.result === 1) {
          return responseHandler(res, messages.DELETED, result.data);
        }

        return errorResponse(res, messages.FAILED, 400);
      } catch (err) {
        return errorHandler(res, err);
      }
    },
  };
};

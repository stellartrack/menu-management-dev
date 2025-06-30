// factory/base.controller.factory.js

import {
  successResponse,
  errorResponse,
} from "../../helpers/response.helper.js";
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

  // const resolveMethod = (type, fallback) => {
  //   const method = service[aliases[type] || fallback];
  //   if (typeof method !== "function") {
  //     console.warn(`⚠️  Controller function type for "${type}" is not a function.`);
  //   }
  //   return method;
  // };
  const resolveMethod = (type, fallback) => {
    const methodName = aliases[type] || fallback;
    const method = service[methodName];

    if (!method) {
      console.warn(
        `⚠️ [resolveMethod] No method '${methodName}' found for type '${type}' in service.`
      );
    } else {
      console.log(
        `🔧 [resolveMethod] Resolved method '${methodName}' for type '${type}'.`
      );
    }

    return method;
  };

  return {
    // 🔁 CREATE or UPSERT
    create: async (req, res) => {
      try {
        console.log("📝 [create] Incoming Request Body:", req.body);
        console.log("📝 [create] Request Params:", req.params);
        console.log("📝 [create] Request User:", req.user);

        const payload = buildPayload(req, "create");
        console.log("✅ [create] Payload After buildPayload:", payload);

        console.log("🧪 Available methods in service:", Object.keys(service));

        const method = resolveMethod("create", "create");

        if (!method || typeof method !== "function") {
          console.error("❌ [create] No valid method found in service.");
          return errorResponse(res, "Create method not found in service", 500);
        }

        const result = await method(payload);

        console.log("📦 [create] Service Result:", result);

        const isUpdate = !!req.body.menuID;
        if (Number(result?.data?.result) === 1) {
          return responseHandler(
            res,
            isUpdate ? messages.UPDATED : messages.CREATED,
            result.data,
            isUpdate ? 200 : 201
          );
        }

        return errorResponse(
          res,
          messages.FAILED,
          400,
          result?.data?.errors || []
        );
      } catch (err) {
        console.error("❌ [create] Error:", err);
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
        const payload = buildPayload(req, "update");
        const result = await resolveMethod("update", "update")(payload);

        if (Number(result?.data?.result) === 1) {
          return responseHandler(res, messages.UPDATED, result.data);
        }

        return errorResponse(
          res,
          messages.FAILED,
          400,
          result?.data?.errors || []
        );
      } catch (err) {
        return errorHandler(res, err);
      }
    },

    // ❌ DELETE
    remove: async (req, res) => {
      try {
        const payload = buildPayload(req, "remove");

        console.log("🔍 [Remove] Final Payload sent to service:", payload);
        // if (!payload.RoleName) {
        //   payload.RoleName = req.query?.RoleName || "Unknown"; 
        // }

        const method = resolveMethod("remove", "delete");

        if (!method || typeof method !== "function") {
          console.error("❌ [Remove] No valid delete method found in service.");
          return errorResponse(res, "Delete method not found in service", 500);
        }

        const result = await method(payload);

        console.log("✅ [Remove] Response from API:", result?.data);

        if (result?.data?.result === 1) {
          return responseHandler(res, messages.DELETED, result.data);
        }

        return errorResponse(
          res,
          result?.data?.message || messages.FAILED,
          400,
          result?.data?.errors || []
        );
      } catch (err) {
        console.error("❌ [Remove] Error:", err?.response?.data || err);
        return errorHandler(res, err);
      }
    },
  };
};

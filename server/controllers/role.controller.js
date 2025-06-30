// controllers/role.controller.js

import { createBaseController } from "./factory/base.controller.factory.js";
import { RoleService } from "../services/role.service.js";
import { MESSAGES } from "../constants/messages.js";
import { successResponse, errorResponse } from "../helpers/response.helper.js";
import { handleControllerError } from "../helpers/errorHandler.helper.js";

/**
 * Custom payload builder for Role requests
 */
// const buildRolePayload = (req) => ({

//   ...req.body,
//   Role_CMPID_ID: req.params?.id || req.body?.Role_CMPID_ID,
//   loguserNewEMPID: req.user?.sub?.new_emp_id || null,

// });

const buildRolePayload = (req) => {
  console.log("🔍 [buildRolePayload] req.body:", req.body);
  console.log("🔍 [buildRolePayload] req.params:", req.params);
  console.log("🔍 [buildRolePayload] req.user:", req.user);

  const payload = {
    ...req.body,
    Role_CMPID_ID: Number(req.params?.id || req.body?.Role_CMPID_ID),
    CMPID: req.body?.CMPID || 1,
    log_NewEmpid: req.body?.log_NewEmpid || req.user?.sub?.new_emp_id || 1,
    RoleName: req.body?.RoleName,
  };

  console.log("✅ [buildRolePayload] Final Payload:", payload);
  return payload;
};

export const RoleController = {
  ...createBaseController(RoleService, {
    messages: MESSAGES.ROLE,
    aliases: {
      create: "create",
      update: "update",
      remove: "delete",
    },
    buildPayload: buildRolePayload,
  }),

  /**
   * Get global roles (example of custom controller)
   */
  getGlobal: async (req, res) => {
    try {
      console.log("Fetching global roles with params:", {
        RoleName: req.query?.Role_Name || "%",
        log_NewEmpid: req.user?.sub?.new_emp_id || 1,
      });
      const result = await RoleService.getGlobal({
        RoleName: req.query?.Role_Name || "%",
        log_NewEmpid: req.user?.sub?.new_emp_id || 1,
      });

      if (result?.data) {
        return successResponse(res, MESSAGES.ROLE.FETCHED, result.data);
      }

      return errorResponse(res, MESSAGES.ROLE.NOT_FOUND, 404);
    } catch (err) {
      return handleControllerError(res, err);
    }
  },

  /**
   * Get company-specific roles
   */
  getCompany: async (req, res) => {
    try {
      const result = await RoleService.getCompany({
        cmp_id: req.user?.sub?.cmp_id,
      });

      if (result?.data) {
        return successResponse(res, MESSAGES.ROLE.FETCHED, result.data);
      }

      return errorResponse(res, MESSAGES.ROLE.NOT_FOUND, 404);
    } catch (err) {
      return handleControllerError(res, err);
    }
  },
};

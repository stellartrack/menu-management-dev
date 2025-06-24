// controllers/role.controller.js

import { createBaseController } from "./factory/base.controller.factory.js";
import { RoleService } from "../services/role.service.js";
import { MESSAGES } from "../constants/messages.js";

const buildRolePayload = (req) => ({
  ...req.body,
  Role_CMPID_ID: req.params?.id || req.body?.Role_CMPID_ID,
  loguserNewEMPID: req.user?.sub?.new_emp_id || null,
});

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

  getGlobal: (req, res) => RoleController.get(req, res),
  getCompany: (req, res) => RoleController.get(req, res),

};

import { createBaseController } from "./factory/base.controller.factory.js";
import { MenuService } from "../services/menu.service.js";
import { MESSAGES } from "../constants/messages.js";

// Build payload including audit fields
const buildMenuPayload = (req) => ({
  ...req.body,
  loguserNewEMPID: req.user?.sub?.new_emp_id || null,
});

// Export the controller
export const MenuController = createBaseController(MenuService, {
  messages: MESSAGES.MENU,
  aliases: {
    create: "insertOrUpdate",
    get: "fetchTree",
    remove: "delete",
  },
  buildPayload: buildMenuPayload,
});

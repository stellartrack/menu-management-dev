import { createBaseController } from "./factory/base.controller.factory.js";
import { MenuService } from "../services/menu.service.js";
import { MESSAGES } from "../constants/messages.js";

// Build payload including audit fields
const buildMenuPayload = (req, type) => {
  const now = new Date().toISOString();

  const base = {
    ...req.body,
    loguserNewEMPID: req.user?.sub?.new_emp_id || null,
  };

  if (type === "create") {
    return {
      ...base,
      createdAt: req.body.createdAt || now,
      updatedAt: now,
    };
  }

  if (type === "update") {
    return {
      ...base,
      updatedAt: now,
    };
  }

  return base;
};


// Export the controller
export const MenuController = createBaseController(MenuService, {
  messages: MESSAGES.MENU,
  aliases: {
    create: "create",
    get: "fetchTree",
    remove: "remove",
  },
  buildPayload: buildMenuPayload,
});

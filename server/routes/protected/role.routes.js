import express from "express";
import { RoleController } from "../../controllers/role.controller.js";
import { validateRequest } from "../../middleware/validation/validateRequest.middleware.js";
import {
  validateInsertRole,
  validateModifyRole,
  validateDeleteRole,
  validateGetRolesGlobal,
  validateGetCompanyRolesList,
} from "../../validators/role.validator.js";

const router = express.Router();

router.post("/role", validateInsertRole, validateRequest, RoleController.create);
router.put("/role/:id", validateModifyRole, validateRequest, RoleController.update);
router.post("/role/:id", validateDeleteRole, validateRequest, RoleController.remove);
router.get("/roles/global", validateGetRolesGlobal, validateRequest, RoleController.getGlobal);
router.get("/roles/company", validateGetCompanyRolesList, validateRequest, RoleController.getCompany);

export default router;

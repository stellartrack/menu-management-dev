// validators/role.validator.js
import { createValidators } from "../utils/validatorFactory.js";

// 🆕 Insert Role
export const validateInsertRole = createValidators({
  body: {
    RoleName: [["notEmpty", { errorMessage: "RoleName is required" }]],
    CabinetID: [["notEmpty", { errorMessage: "CabinetID is required" }]],
  },
});

// ✏️ Modify Role
export const validateModifyRole = createValidators({
  param: {
    id: [["notEmpty", { errorMessage: "Role_CMPID_ID param is required" }]],
  },
  body: {
    RoleName: [["notEmpty", { errorMessage: "RoleName is required" }]],
    CabinetID: [["notEmpty", { errorMessage: "CabinetID is required" }]],
  },
});

// ❌ Delete Role
export const validateDeleteRole = createValidators({
  param: {
    id: [["notEmpty", { errorMessage: "Role_CMPID_ID param is required" }]],
  },
  body: {
  },
});

// 🌐 Get Global Roles
export const validateGetRolesGlobal = createValidators({
  body: {
    // RoleName: [["notEmpty", { errorMessage: "RoleName is required" }]],
    // log_NewEmpid: [["notEmpty", { errorMessage: "log_NewEmpid is required" }]],
  },
});

// 🏢 Get Company Roles List
export const validateGetCompanyRolesList = createValidators({
  body: {
  },
});


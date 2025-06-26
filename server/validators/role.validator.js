// validators/role.validator.js
import { createValidators } from "../utils/validatorFactory.js";

// 🆕 Insert Role
export const validateInsertRole = createValidators({
  body: {
    RoleName: [["notEmpty", { errorMessage: "RoleName is required" }]],
    CabinetID: [["notEmpty", { errorMessage: "CabinetID is required" }]],
    CMPID: [["notEmpty", { errorMessage: "CMPID is required" }]],
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
    CMPID: [["notEmpty", { errorMessage: "CMPID is required" }]],
  },
});

// ❌ Delete Role
export const validateDeleteRole = createValidators({
  param: {
    id: [["notEmpty", { errorMessage: "Role_CMPID_ID param is required" }]],
  },
  body: {
    CMPID: [["notEmpty", { errorMessage: "CMPID is required" }]],
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
    CMPID: [["notEmpty", { errorMessage: "CMPID is required" }]],
    RoleName: [["notEmpty", { errorMessage: "RoleName is required" }]],
    Roleid: [["notEmpty", { errorMessage: "Roleid is required" }]],
    CabinetID: [["notEmpty", { errorMessage: "CabinetID is required" }]],
    IS_Active: [["notEmpty", { errorMessage: "IS_Active is required" }]],
    log_NewEmpid: [["notEmpty", { errorMessage: "log_NewEmpid is required" }]],
  },
});


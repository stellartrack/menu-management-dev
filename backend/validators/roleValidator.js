const { body } = require("express-validator");

exports.validateCreateRole = [
  body("roleName").notEmpty().withMessage("roleName is required"),
];

exports.validateRoleMenuMapping = [
  body("roleId").isInt().withMessage("roleId must be an integer"),
  body("menuIds").isArray({ min: 1 }).withMessage("menuIds must be a non-empty array"),
];
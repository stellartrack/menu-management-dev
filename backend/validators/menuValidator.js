const { body, query } = require("express-validator");


exports.validateMenuInsertUpdate = [
  // When type is "drop", these three are mandatory:
  body("deptCabinetId")
    .if((value, { req }) => req.body.type === "drop")
    .notEmpty().withMessage("deptCabinetId is required for drop")
    .bail()
    .isInt().withMessage("deptCabinetId must be an integer for drop"),

  body("menuID")
    .if((value, { req }) => req.body.type === "drop")
    .notEmpty().withMessage("menuID is required for drop")
    .bail()
    .isInt().withMessage("menuID must be an integer for drop"),

  body("parentID")
    .if((value, { req }) => req.body.type === "drop")
    .notEmpty().withMessage("parentID is required for drop")
    .bail()
    .custom((value) => {
      // Accept integer or null/0 if allowed
      if (value === null || value === "null" || value === 0 || Number.isInteger(Number(value))) {
        return true;
      }
      throw new Error("parentID must be integer, null or 0 for drop");
    }),

  // When type is NOT "drop", require menuName and MenuType
  body("menuName")
    .if((value, { req }) => req.body.type !== "drop")
    .notEmpty().withMessage("menuName is required"),

  body("MenuType")
    .if((value, { req }) => req.body.type !== "drop")
    .notEmpty().withMessage("MenuType is required")
    .bail()
    .isIn(["1", "2", "3"]).withMessage("MenuType must be '1', '2' or '3'"),
];


exports.validateMenuDelete = [
  body("menuID").isInt().withMessage("menuID must be an integer"),
];

exports.validateGetTree = [
  query("dept_cabinet_id").isInt().withMessage("Cabinet is required"),
];
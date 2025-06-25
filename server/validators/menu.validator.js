import { body, query } from "express-validator";

// POST/PUT - Create or Update
export const validateCreateOrUpdateMenu = [
  body("menuName").notEmpty().withMessage("Menu name is required"),
  body("deptCabinetId").notEmpty().withMessage("Cabinet ID is required"),
];

// GET - Tree
export const validateGetMenuTreeStructure = [
  query("dept_cabinet_id").optional(),
  query("ParentMenuID").optional(),
  query("MenuID").optional(),
];

// DELETE - Menu
export const validateDeleteMenu = [
  body("MenuID").notEmpty().withMessage("Menu ID is required for deletion"),
];

const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const roleValidator = require("../validators/roleValidator");

router.post("/role", roleValidator.validateCreateRole, roleController.createRole);
router.post("/role/menu", roleValidator.validateRoleMenuMapping, roleController.mapRoleToMenus);
router.get("/role/:id/menus", roleController.getMenusByRole);

module.exports = router;
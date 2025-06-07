const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const menuValidator = require("../validators/menuValidator");

router.post("/menu", menuValidator.validateMenuInsertUpdate, menuController.menuInsertUpdate);
router.get("/menus", menuValidator.validateGetTree, menuController.getMenuTree);
router.post("/menu/delete", menuValidator.validateMenuDelete, menuController.menuDelete);

module.exports = router;
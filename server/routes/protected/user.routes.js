// routes/protected/user.routes.js

import express from "express";
import { UserController } from "../../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", UserController.getProfile);

export default router;

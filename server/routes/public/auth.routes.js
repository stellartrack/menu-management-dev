import { Router } from 'express';
import {
  setAuth,
  logout,
  AuthController,
} from '../../controllers/auth.controller.js';

import validateSetAuth from '../../middleware/validation/validateToken.middleware.js';

const router = Router();

// Manual Auth Routes
router.post('/set-auth', validateSetAuth, setAuth);
router.post('/logout', logout);

// Laravel-based token checks using base controller
router.get('/check-token', AuthController.get);
router.post('/refresh-token', AuthController.create);

export default router;

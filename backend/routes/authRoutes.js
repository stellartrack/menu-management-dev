const express = require('express');
const router = express.Router();

const { setAuth, logout, checkTokenExpiry, refreshToken } = require('../controllers/authController');
const { validateSetAuth } = require('../middleware/authValidator');

router.post('/set-auth', validateSetAuth, setAuth);
router.post('/logout', logout);

// New endpoints
router.get('/check-token', checkTokenExpiry);
router.post('/refresh-token', refreshToken);

module.exports = router;

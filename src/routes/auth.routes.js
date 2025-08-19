const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Refresh token & logout (need auth)
const authMiddleware = require('../middleware/auth.middleware');
router.post('/refresh', authMiddleware, authController.refresh);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;

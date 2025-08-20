// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { validateBody } = require('../utils/validator.util');
const authController = require('../controllers/auth.controller');

router.post('/register', validateBody(['name', 'email', 'password']), authController.register);
router.post('/login', validateBody(['email', 'password']), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

module.exports = router;

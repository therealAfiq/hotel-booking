// src/routes/auth.routes.js
const express = require('express');
const { validateBody } = require('../utils/validator.util');
const authController = require('../controllers/auth.controller');
const { registerSchema, loginSchema } = require('../validators/auth.schemas');
const validate = require('../middlewares/validate.middleware');

const router = express.Router();

// router.post('/register', validateBody(['name', 'email', 'password']), authController.register);
// router.post('/login', validateBody(['email', 'password']), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

 router.post('/register', validate(registerSchema), authController.register);
 router.post('/login', validate(loginSchema), authController.login);

module.exports = router;

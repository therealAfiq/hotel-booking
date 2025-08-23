// src/routes/auth.routes.js
const express = require('express');
const { validateBody } = require('../utils/validator.util');
const authController = require('../controllers/auth.controller');
const { registerSchema, loginSchema } = require('../validators/auth.schemas');
const validate = require('../middlewares/validate.middleware');

const router = express.Router();

// router.post('/register', validateBody(['name', 'email', 'password']), authController.register);
// router.post('/login', validateBody(['email', 'password']), authController.login);
/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
 router.post('/register', validate(registerSchema), authController.register);
 /**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login and retrieve JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6...
 *       401:
 *         description: Invalid credentials
 */
 router.post('/login', validate(loginSchema), authController.login);
 /**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.post('/refresh', authController.refresh);
/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post('/logout', authController.logout);



module.exports = router;

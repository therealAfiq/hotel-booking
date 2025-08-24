// src/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const { createUserByAdmin, getAllUsers } = require('../controllers/admin.controller');
const validate = require('../middlewares/validate.middleware');
const { adminRegisterSchema } = require('../validators/auth.schemas');
const  authenticate  = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

/**
 * @openapi
 * /admin/register:
 *   post:
 *     summary: Register a new user (admin-only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: admin
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       403:
 *         description: Forbidden (not an admin)
 */

// ✅ Only admins can access this
router.post(
  '/register',
  authenticate,
  requireRole('admin'),
  validate(adminRegisterSchema),
  createUserByAdmin
);

/**
 * @openapi
 * /admin/users:
 *   get:
 *     summary: Get all users (admin-only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *       401:
 *         description: Unauthorized (not logged in)
 *       403:
 *         description: Forbidden (not an admin)
 */
router.get('/users', authenticate, requireRole('admin'), getAllUsers);

module.exports = router;

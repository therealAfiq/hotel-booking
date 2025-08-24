// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const userController = require('../controllers/user.controller');


/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the profile information of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successfully retrieved current user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (no token or invalid token)
 *
 * /users:
 *   get:
 *     summary: List all users
 *     description: Admin only. Retrieves a list of all registered users.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successfully retrieved list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *
 * /users/{id}/role:
 *   patch:
 *     summary: Update user role
 *     description: Admin only. Updates the role of a user by their ID.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose role will be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *             required:
 *               - role
 *     responses:
 *       200:
 *         description: Successfully updated user role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request (invalid role)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: User not found
 */
router.get('/me', auth, userController.getMe);
router.get('/', auth, requireRole('admin'), userController.listUsers);
router.patch('/:id/role', auth, requireRole('admin'), userController.updateUserRole);

module.exports = router;

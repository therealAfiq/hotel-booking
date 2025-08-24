// src/routes/room.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const { validateBody } = require('../utils/validator.util');
const roomController = require('../controllers/room.controller');


/**
 * @openapi
 * /rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, capacity]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Deluxe Suite
 *               price:
 *                 type: number
 *                 example: 250
 *               capacity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Room successfully created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (no token)
 *       403:
 *         description: Forbidden (not an admin)
 *
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of all rooms
 *
 * /rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room details
 *       404:
 *         description: Room not found
 *
 *   patch:
 *     summary: Update a room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               capacity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Room not found
 *
 *   delete:
 *     summary: Delete a room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Room not found
 */
router.post('/', auth, requireRole('admin'), validateBody(['name', 'price', 'capacity']), roomController.createRoom);
router.get('/', roomController.listRooms);
router.get('/:id', roomController.getRoomById);
router.patch('/:id', auth, requireRole('admin'), roomController.updateRoom);
router.delete('/:id', auth, requireRole('admin'), roomController.deleteRoom);

module.exports = router;

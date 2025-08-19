const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Protected route for admin to create room
router.post('/', authMiddleware, roomController.createRoom);

// Public route to list rooms
router.get('/', roomController.getRooms);

module.exports = router;

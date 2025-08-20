// src/routes/room.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const { validateBody } = require('../utils/validator.util');
const roomController = require('../controllers/room.controller');

router.post('/', auth, requireRole('admin'), validateBody(['name', 'price', 'capacity']), roomController.createRoom);
router.get('/', roomController.listRooms);
router.get('/:id', roomController.getRoomById);
router.patch('/:id', auth, requireRole('admin'), roomController.updateRoom);
router.delete('/:id', auth, requireRole('admin'), roomController.deleteRoom);

module.exports = router;

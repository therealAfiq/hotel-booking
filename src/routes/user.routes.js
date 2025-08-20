// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const userController = require('../controllers/user.controller');

router.get('/me', auth, userController.getMe);
router.get('/', auth, requireRole('admin'), userController.listUsers);
router.patch('/:id/role', auth, requireRole('admin'), userController.updateUserRole);

module.exports = router;

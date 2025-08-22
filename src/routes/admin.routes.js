// src/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const { createUserByAdmin } = require('../controllers/admin.controller');
const validate = require('../middlewares/validate.middleware');
const { adminRegisterSchema } = require('../validators/auth.schemas');
const  authenticate  = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

// ✅ Only admins can access this
router.post(
  '/register',
  authenticate,
  requireRole('admin'),
  validate(adminRegisterSchema),
  createUserByAdmin
);

module.exports = router;

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/checkout', authMiddleware, paymentController.createCheckoutSession);

module.exports = router;

// src/routes/payment.routes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const auth = require('../middlewares/auth.middleware');

// Authenticated users can start a checkout session
router.post('/create-checkout-session', auth, paymentController.createCheckoutSession);

// Webhook (no auth; Stripe calls this)
router.post('/webhook', paymentController.stripeWebhook);

// ✅ Success and Cancel pages
router.get('/success', (req, res) => {
  res.send('<h1>Payment successful 🎉</h1><p>Your booking has been confirmed.</p>');
});

router.get('/cancel', (req, res) => {
  res.send('<h1>Payment cancelled ❌</h1><p>Your booking was not completed.</p>');
});

module.exports = router;

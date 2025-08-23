// src/routes/payment.routes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const auth = require('../middlewares/auth.middleware');


/**
 * @openapi
 * /payments/create-checkout-session:
 *   post:
 *     summary: Create a Stripe Checkout Session for a booking
 *     description: Starts a payment flow for a specific booking. Returns a Stripe-hosted checkout URL.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookingId]
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: 66c8b56a94d9ab12715ecf92
 *     responses:
 *       200:
 *         description: Checkout session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   format: uri
 *                   example: https://checkout.stripe.com/c/pay_cs_test_12345
 *                 sessionId:
 *                   type: string
 *                   example: cs_test_a1B2c3D4e5
 *       400:
 *         description: Validation error or booking not eligible
 *       401:
 *         description: Unauthorized (missing/invalid token)
 */
// Authenticated users can start a checkout session
router.post('/create-checkout-session', auth, paymentController.createCheckoutSession);


/**
 * @openapi
 * /payments/webhook:
 *   post:
 *     summary: Stripe webhook endpoint
 *     description: Receives Stripe events (e.g., checkout.session.completed). No authentication required, but Stripe signature header is validated.
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     parameters:
 *       - in: header
 *         name: Stripe-Signature
 *         required: true
 *         schema:
 *           type: string
 *         description: Stripe signature header used to verify the webhook payload.
 *     responses:
 *       200:
 *         description: Webhook received/processed
 *       400:
 *         description: Invalid payload or signature
 */
// Webhook (no auth; Stripe calls this)
router.post('/webhook', paymentController.stripeWebhook);


/**
 * @openapi
 * /payments/success:
 *   get:
 *     summary: Payment success page
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: HTML success message
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<h1>Payment successful 🎉</h1><p>Your booking has been confirmed.</p>"
 */

/**
 * @openapi
 * /payments/cancel:
 *   get:
 *     summary: Payment cancel page
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: HTML cancel message
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<h1>Payment cancelled ❌</h1><p>Your booking was not completed.</p>"
 */
// ✅ Success and Cancel pages
router.get('/success', (req, res) => {
  res.send('<h1>Payment successful 🎉</h1><p>Your booking has been confirmed.</p>');
});

router.get('/cancel', (req, res) => {
  res.send('<h1>Payment cancelled ❌</h1><p>Your booking was not completed.</p>');
});

module.exports = router;

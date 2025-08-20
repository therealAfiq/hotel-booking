// src/controllers/payment.controller.js
const paymentService = require('../services/payment.service');

/**
 * POST /api/v1/payments/create-checkout-session
 */
async function createCheckoutSession(req, res) {
  try {
    const result = await paymentService.createCheckoutSession({
      bookingId: req.body.bookingId,
      user: req.user, // auth middleware attaches { id, role }
      // optional: can accept successUrl / cancelUrl from client
      successUrl: req.body.successUrl,
      cancelUrl: req.body.cancelUrl,
    });
    return res.json(result);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
  }
}

/**
 * POST /api/v1/payments/webhook
 * NOTE: app.js registers this route with express.raw so req.body is the raw payload (Buffer/string)
 */
async function stripeWebhook(req, res) {
  try {
    const rawBody = req.body; // express.raw provides raw body here (Buffer)
    const signature = req.headers['stripe-signature'];

    // small debug log - you can remove later
    // console.log('🔔 Received Stripe webhook:', req.headers['stripe-signature'] ? 'has signature' : 'no signature');

    const result = await paymentService.handleWebhook({ rawBody, signature });
    return res.json(result);
  } catch (err) {
    const status = err.status || 500;
    // For Stripe it's fine to send plain text on signature error
    return res.status(status).send(err.message);
  }
}

module.exports = {
  createCheckoutSession,
  stripeWebhook,
};

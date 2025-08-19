const paymentService = require('../services/payment.service');

async function createCheckoutSession(req, res) {
  try {
    const session = await paymentService.createCheckoutSession(req.user.id, req.body.bookingId);
    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = { createCheckoutSession };

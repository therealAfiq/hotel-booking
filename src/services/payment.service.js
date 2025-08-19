const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/payment.model');
const Booking = require('../models/booking.model');

async function createCheckoutSession(userId, bookingId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error('Booking not found');

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: `Booking ${bookingId}` },
        unit_amount: booking.totalPrice * 100,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
  });

  await Payment.create({ user: userId, booking: bookingId, sessionId: session.id });

  return session;
}

module.exports = { createCheckoutSession };

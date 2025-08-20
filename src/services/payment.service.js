// src/services/payment.service.js
const Stripe = require('stripe');
const config = require('../config');
const Booking = require('../models/booking.model');
const Payment = require('../models/payment.model');

const stripeKey = (config && config.stripe && config.stripe.secretKey) || process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

/* normalize a URL (simple) */
function ensureUrl(url, fallback) {
  if (!url) return fallback;
  if (/^https?:\/\//i.test(url)) return url;
  return `http://${url}`;
}

/**
 * Create checkout session
 * - forces server-side success/cancel URL (defaults to server base)
 * - ensures payment record exists (upsert) with stripeSessionId
 */
async function createCheckoutSession({ bookingId, user, successUrl, cancelUrl }) {
  if (!stripe) {
    const e = new Error('Stripe not configured (STRIPE_SECRET_KEY missing)');
    e.status = 500;
    throw e;
  }

  if (!bookingId) {
    const e = new Error('Booking ID is required');
    e.status = 400;
    throw e;
  }

  const booking = await Booking.findById(bookingId).populate('room');
  if (!booking) {
    const e = new Error('Booking not found');
    e.status = 404;
    throw e;
  }

  // ownership check: user must own booking or be admin
  if (user?.role !== 'admin' && booking.user?.toString() !== user?.id) {
    const e = new Error('Forbidden: you do not own this booking');
    e.status = 403;
    throw e;
  }

  const amount = Number(booking.totalAmount ?? booking.totalPrice ?? 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    const e = new Error('Invalid booking amount');
    e.status = 400;
    throw e;
  }

  // prefer config.urls.server (your backend). if not set, fallback to SERVER_URL env or localhost:3000
  const serverBase = ensureUrl(
    (config && config.urls && config.urls.server) || process.env.SERVER_URL || 'http://localhost:3000',
    'http://localhost:3000'
  );

  const finalSuccess = successUrl ? ensureUrl(successUrl, serverBase) : `${serverBase}/api/v1/payments/success?session_id={CHECKOUT_SESSION_ID}`;
  const finalCancel = cancelUrl ? ensureUrl(cancelUrl, serverBase) : `${serverBase}/api/v1/payments/cancel`;

  const currency = (config && config.stripe && config.stripe.currency) || process.env.STRIPE_CURRENCY || 'usd';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: booking.room?.name ? `Room: ${booking.room.name}` : 'Room booking',
            description: booking.room?.description || '',
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    success_url: finalSuccess,
    cancel_url: finalCancel,
    metadata: {
      bookingId: booking._id.toString(),
      userId: user?.id || '',
    },
  });

  // Upsert payment record by booking id, save stripeSessionId for webhook matching
  await Payment.findOneAndUpdate(
    { booking: booking._id },
    {
      booking: booking._id,
      amount,
      currency,
      provider: 'stripe',
      status: 'pending',
      transactionId: session.payment_intent || null,
      stripeSessionId: session.id,
    },
    { upsert: true, new: true }
  );

  return { url: session.url, id: session.id };
}

/**
 * Handle webhook
 * - rawBody must be the exact payload (Buffer or raw string)
 * - signature is the stripe-signature header
 */
async function handleWebhook({ rawBody, signature }) {
  if (!stripe) {
    const e = new Error('Stripe not configured (STRIPE_SECRET_KEY missing)');
    e.status = 500;
    throw e;
  }

  const webhookSecret = (config && config.stripe && config.stripe.webhookSecret) || process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    const e = new Error('Stripe webhook secret not configured (STRIPE_WEBHOOK_SECRET)');
    e.status = 500;
    throw e;
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const e = new Error(`Webhook signature verification failed: ${err.message}`);
    e.status = 400;
    throw e;
  }

  // handle relevant events
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session?.metadata?.bookingId;

    // robustly try to find the Payment by several identifiers
    const query = {
      $or: [
        { stripeSessionId: session.id },
        { transactionId: session.payment_intent },
        { transactionId: session.id },
      ],
    };

    await Payment.findOneAndUpdate(
      query,
      {
        status: 'paid',
        transactionId: session.payment_intent || session.id,
      },
      { new: true }
    );

    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, { status: 'confirmed', paidAt: new Date() });
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object;
    await Payment.findOneAndUpdate({ transactionId: pi.id }, { status: 'failed' }, { new: true });
  }

  // For any other events you may want to log them
  return { received: true };
}

module.exports = {
  createCheckoutSession,
  handleWebhook,
};

// src/models/payment.model.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    // Who paid & for which booking
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },

    // Money
    amount: { type: Number, required: true }, // stored in major units (e.g. USD dollars)
    currency: { type: String, default: 'usd' },

    // Status
    status: {
      type: String,
      enum: ['paid', 'unpaid', 'requires_payment_method', 'processing', 'canceled'],
      default: 'unpaid',
      index: true,
    },

    // Stripe references
    stripeSessionId: { type: String, index: true },
    stripePaymentIntentId: { type: String, index: true },

    // Optional card snapshot (from webhook expand)
    paymentMethod: {
      type: String,
    },
    cardBrand: { type: String },
    cardLast4: { type: String },

    // Receipt
    receiptUrl: { type: String },

    // Convenience mirror
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Useful compound index for admin lookups
PaymentSchema.index({ userId: 1, bookingId: 1 });

module.exports = mongoose.model('Payment', PaymentSchema);

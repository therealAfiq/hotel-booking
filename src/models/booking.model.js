// src/models/booking.model.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  checkIn: Date,
  checkOut: Date,
  totalPrice: Number,
  status: { type: String, default: "pending" }, // pending, paid, cancelled
  isPaid: { type: Boolean, default: false },    // quick flag
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);

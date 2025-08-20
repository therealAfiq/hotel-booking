// src/services/booking.service.js
const Booking = require('../models/booking.model');
const Room = require('../models/room.model');

function nightsBetween(a, b) {
  const ms = new Date(b).setHours(0,0,0,0) - new Date(a).setHours(0,0,0,0);
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

async function createBooking(userId, { roomId, checkIn, checkOut }) {
  const room = await Room.findById(roomId);
  if (!room) throw new Error('Room not found');
  const nights = nightsBetween(checkIn, checkOut);
  const total = nights * Number(room.price);

  const booking = await Booking.create({
    user: userId,
    room: room._id,
    checkIn,
    checkOut,
    status: 'pending',
    totalAmount: total,
  });
  return booking;
}

async function listBookingsForUserOrAdmin(user) {
  if (user.role === 'admin') {
    return Booking.find().populate('room user', 'name email price').sort({ createdAt: -1 });
  }
  return Booking.find({ user: user.id }).populate('room', 'name price').sort({ createdAt: -1 });
}

async function getBookingById(bookingId, user) {
  const booking = await Booking.findById(bookingId).populate('room user', 'name email price');
  if (!booking) throw new Error('Booking not found');
  if (user.role !== 'admin' && booking.user.toString() !== user.id) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  return booking;
}

async function cancelBooking(bookingId, user) {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error('Booking not found');
  if (user.role !== 'admin' && booking.user.toString() !== user.id) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  booking.status = 'cancelled';
  await booking.save();
  return booking;
}

module.exports = {
  createBooking,
  listBookingsForUserOrAdmin,
  getBookingById,
  cancelBooking,
};

const Booking = require('../models/booking.model');
const Room = require('../models/room.model');

async function createBooking(userId, bookingData) {
  const { roomId, checkIn, checkOut } = bookingData;
  const room = await Room.findById(roomId);
  if (!room) throw new Error('Room not found');

  const booking = new Booking({ user: userId, room: roomId, checkIn, checkOut });
  await booking.save();
  return booking;
}

async function listUserBookings(userId) {
  return Booking.find({ user: userId }).populate('room');
}

async function listAllBookings() {
  return Booking.find({}).populate('room').populate('user');
}

async function cancelBooking(userId, bookingId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error('Booking not found');
  if (booking.user.toString() !== userId && !booking.admin) {
    throw new Error('Unauthorized to cancel this booking');
  }
  await Booking.findByIdAndDelete(bookingId);
  return booking;
}

module.exports = { createBooking, listUserBookings, listAllBookings, cancelBooking };

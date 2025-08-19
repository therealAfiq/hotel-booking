const bookingService = require('../services/booking.service');

async function createBooking(req, res) {
  try {
    const booking = await bookingService.createBooking(req.user.id, req.body);
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getUserBookings(req, res) {
  try {
    const bookings = await bookingService.listUserBookings(req.user.id);
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllBookings(req, res) {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Admins only' });
  try {
    const bookings = await bookingService.listAllBookings();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function cancelBooking(req, res) {
  try {
    const booking = await bookingService.cancelBooking(req.user.id, req.params.id);
    res.status(200).json({ message: 'Booking canceled', booking });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = { createBooking, getUserBookings, getAllBookings, cancelBooking };

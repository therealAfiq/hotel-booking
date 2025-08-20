// src/controllers/booking.controller.js
const bookingService = require('../services/booking.service');

async function createBooking(req, res) {
  try {
    const booking = await bookingService.createBooking(req.user.id, req.body);
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function listBookings(req, res) {
  try {
    const bookings = await bookingService.listBookingsForUserOrAdmin(req.user);
    res.json(bookings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getBookingById(req, res) {
  try {
    const booking = await bookingService.getBookingById(req.params.id, req.user);
    res.json(booking);
  } catch (err) {
    res.status(err.status || 400).json({ message: err.message });
  }
}

async function cancelBooking(req, res) {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.user);
    res.json(booking);
  } catch (err) {
    res.status(err.status || 400).json({ message: err.message });
  }
}

module.exports = { createBooking, listBookings, getBookingById, cancelBooking };

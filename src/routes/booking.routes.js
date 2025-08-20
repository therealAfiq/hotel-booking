// src/routes/booking.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { validateBody } = require('../utils/validator.util');
const bookingController = require('../controllers/booking.controller');

router.use(auth);

router.post('/', validateBody(['roomId', 'checkIn', 'checkOut']), bookingController.createBooking);
router.get('/', bookingController.listBookings);
router.get('/:id', bookingController.getBookingById);
router.delete('/:id', bookingController.cancelBooking);

module.exports = router;

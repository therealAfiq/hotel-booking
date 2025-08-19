const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, bookingController.createBooking);
router.get('/', authMiddleware, bookingController.getUserBookings);
router.get('/all', authMiddleware, bookingController.getAllBookings);
router.delete('/:id', authMiddleware, bookingController.cancelBooking);

module.exports = router;

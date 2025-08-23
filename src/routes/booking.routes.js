// src/routes/booking.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { validateBody } = require('../utils/validator.util');
const bookingController = require('../controllers/booking.controller');


/**
 * @openapi
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roomId, checkIn, checkOut]
 *             properties:
 *               roomId:
 *                 type: string
 *                 example: 64db82f123abc456
 *               checkIn:
 *                 type: string
 *                 format: date
 *                 example: 2025-08-25
 *               checkOut:
 *                 type: string
 *                 format: date
 *                 example: 2025-08-28
 *     responses:
 *       201:
 *         description: Booking successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (no token or invalid token)
 *
 *   get:
 *     summary: List all bookings for the authenticated user
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized
 *
 * /bookings/{id}:
 *   get:
 *     summary: Get booking details by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 *
 *   delete:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
router.use(auth);

router.post('/', validateBody(['roomId', 'checkIn', 'checkOut']), bookingController.createBooking);
router.get('/', bookingController.listBookings);
router.get('/:id', bookingController.getBookingById);
router.delete('/:id', bookingController.cancelBooking);

module.exports = router;

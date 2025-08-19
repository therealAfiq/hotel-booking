const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Routes
const authRoutes = require('./routes/auth.routes');
const bookingRoutes = require('./routes/booking.routes');
const roomRoutes = require('./routes/room.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/payments', paymentRoutes);

// Health check
app.get('/', (req, res) => res.send('API is running'));

module.exports = app;

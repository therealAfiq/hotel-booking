// src/app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerDocs = require('./docs/swagger');
const config = require('./config');
const limiter = require('./middlewares/rateLimiter.middleware');
const errorHandler = require('./middlewares/error.middleware');
const logger = require('./utils/logger.util');

// Routers
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const roomRoutes = require('./routes/room.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes');
const healthRoutes = require('./routes/health.routes');
const paymentController = require('./controllers/payment.controller'); // for webhook


const app = express();

// Security + rate-limit
app.use(helmet());
app.use(limiter);

// CORS (adjust as needed)
app.use(cors({ origin: '*'}));


// Cookies
app.use(cookieParser(config.cookieSecret));

// Stripe webhook must be RAW and must come BEFORE express.json()
app.post('/api/v1/payments/webhook', express.raw({ type: 'application/json' }), paymentController.stripeWebhook);

// JSON body after webhook
app.use(express.json());

// Simple request logger
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Mount API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api', healthRoutes);

// Health
app.get('/health', (_req, res) => res.json({ ok: true }));

swaggerDocs(app);

// Error handler (last)
app.use(errorHandler);


module.exports = app;

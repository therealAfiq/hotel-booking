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
const paymentController = require('./controllers/payment.controller');

const app = express();

app.use(helmet());
app.use(limiter);

// ✅ Flexible CORS — works for Render + localhost
app.use(cors({
  origin: true, // reflect the request origin
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.options('*', cors({ origin: true, credentials: true }));

app.use(cookieParser(config.cookieSecret));

// Stripe webhook before JSON parser
app.post(
  '/api/v1/payments/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.stripeWebhook
);

app.use(express.json());

// Simple request logger
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api', healthRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

swaggerDocs(app);

app.use(errorHandler);

module.exports = app;

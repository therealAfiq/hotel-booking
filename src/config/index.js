// src/config/index.js
const dotenv = require('dotenv');

// Load .env.prod in production, otherwise default to .env
dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.prod'
      : process.env.NODE_ENV === 'test'
      ? '.env.test'
      : '.env',
});

const toInt = (v, def) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : def;
};

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: toInt(process.env.PORT, 3000),
  mongoUri:
    process.env.MONGO_URI ||
    process.env.MONGO_URL ||
    'mongodb://127.0.0.1:27017/project2',

  cookieSecret: process.env.COOKIE_SECRET || 'dev_cookie_secret',

  jwt: {
    accessSecret:
      process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'access_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    accessExpires: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  rateLimit: {
    windowMs: toInt(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000), // 15min
    max: toInt(process.env.RATE_LIMIT_MAX, 100),
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    currency: process.env.STRIPE_CURRENCY || 'usd',
  },

  urls: {
    base: process.env.BASE_URL || 'http://localhost:3000',
    client: process.env.CLIENT_URL || 'http://localhost:5173',
  },
};

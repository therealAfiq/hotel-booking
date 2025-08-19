require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  cookieSecret: process.env.COOKIE_SECRET, // ✅ added cookie secret
  nodeEnv: process.env.NODE_ENV || 'development'
};

module.exports = config;

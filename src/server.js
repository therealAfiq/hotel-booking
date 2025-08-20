// src/server.js
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger.util');

async function start() {
  try {
    await mongoose.connect(config.mongoUri, {
      // modern driver ignores useNewUrlParser/useUnifiedTopology
      maxPoolSize: 10,
    });
    logger.info('✅ Connected to MongoDB');

    app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port}`);
    });
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

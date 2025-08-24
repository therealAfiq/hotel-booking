const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../src/models/user.model');

let mongoServer;

module.exports = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  global.__MONGO_URI__ = mongoUri;
  global.__MONGO_SERVER__ = mongoServer;

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // Seed an admin for admin-only route tests
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminExists = await User.findOne({ email: adminEmail });
  if (!adminExists) {
    await User.create({
      name: 'Test Admin',
      email: adminEmail,
      password: process.env.SEED_ADMIN_PASSWORD ,
      role: 'admin',
    });
  }

  // Optional: cleanup after all tests
  global.__MONGO_CLEANUP__ = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  };
};

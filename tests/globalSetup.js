// tests/globalSetup.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('../src/models/user.model');
const dotenv = require('dotenv');

module.exports = async () => {
  // Load test env
  dotenv.config({ path: '.env.test' });

  // Start in-memory Mongo
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Attach to global for tests
  global.__MONGO_URI__ = uri;
  global.__MONGO_SERVER__ = mongoServer;

  // Connect mongoose
  await mongoose.connect(uri);

  // Seed admin
  await User.deleteMany({}); // clean up just in case
  await User.create({
    name: 'Admin',
    email: "admin@test.com",
    password: "password123",
    role: 'admin',
  });
};

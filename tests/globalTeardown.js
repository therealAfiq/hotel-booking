const mongoose = require('mongoose');

module.exports = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  if (global.__MONGO_SERVER__) {
    await global.__MONGO_SERVER__.stop();
  }
};
// This file is used to clean up the in-memory MongoDB instance after tests
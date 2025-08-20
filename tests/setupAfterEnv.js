// tests/setupAfterEnv.js
const mongoose = require("mongoose");

beforeAll(async () => {
  const uri = process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/testdb";
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

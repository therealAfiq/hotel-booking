module.exports = async () => {
  // Stop in-memory MongoDB if it exists
  if (global.__MONGO_SERVER__) {
    await global.__MONGO_SERVER__.stop();
  }
};


jest.setTimeout(30000);

// Optional: globally available helper to build auth headers quickly
global.buildAuthHeader = function (token) {
  return { Authorization: `Bearer ${token}` };
};

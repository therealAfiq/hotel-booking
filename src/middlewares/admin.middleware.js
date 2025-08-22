// src/middlewares/admin.middleware.js
function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
}
module.exports = adminMiddleware;

// for testing purposes, you can use this middleware in your routes or if you decide to remove joi validation for admin-only routes
// can be used to substitute the requireRole middleware for admin-only routes

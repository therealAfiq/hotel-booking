// src/middlewares/auth.middleware.js
const { verifyAccess, getTokenFromHeader } = require('../utils/token.util');

function authMiddleware(req, res, next) {
  const token = getTokenFromHeader(req);
  if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

  try {
    const decoded = verifyAccess(token);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}

module.exports = authMiddleware;

// src/middlewares/role.middleware.js
function allowRoles(roles = []) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}
function requireRole(role) {
  return allowRoles([role]);
}
module.exports = { allowRoles, requireRole };

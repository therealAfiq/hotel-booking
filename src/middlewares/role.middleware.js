// src/middlewares/role.middleware.js

// Factory: allow a list of roles
function allowRoles(roles = []) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}

// Single-role helper
function requireRole(role) {
  return allowRoles([role]);
}

module.exports = { allowRoles, requireRole };

// src/utils/validator.util.js
function validateBody(requiredFields = []) {
  return (req, res, next) => {
    const missing = requiredFields.filter((f) => req.body[f] == null || req.body[f] === '');
    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }
    next();
  };
}
function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function isStrongPassword(value) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
}
module.exports = { validateBody, isEmail, isStrongPassword };

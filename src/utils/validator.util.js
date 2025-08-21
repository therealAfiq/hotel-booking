// src/utils/validator.util.js
const Joi = require('joi');

/**
 * Validate an array of required fields (simple check)
 * Usage: validateBody(['name', 'email'])
 */
function validateBody(fields = []) {
  return (req, res, next) => {
    const missing = fields.filter(f => req.body[f] === undefined);
    if (missing.length) {
      return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
    }
    next();
  };
}

/**
 * Validate a Joi schema
 * Usage: validate(schema)
 */
function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
}

module.exports = { validateBody, validate };

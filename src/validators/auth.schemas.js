const Joi = require('joi');

// Public register schema (role forbidden)
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.forbidden() 
});

// Admin-only user creation schema
const adminRegisterSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema, adminRegisterSchema };

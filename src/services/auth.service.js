// src/services/auth.service.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

// Helper to generate JWT tokens
function generateTokens(user) {
  const payload = { id: user._id, role: user.role, email: user.email };

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return {
    access: { token: accessToken, expires: '1h' },
    refresh: { token: refreshToken, expires: '7d' },
  };
}

async function register(name, email, password, role = 'user') {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  const user = await User.create({ name, email, password: hashedPassword, role });

  const tokens = generateTokens(user);

  return { user, tokens };
}

async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const tokens = generateTokens(user);

  return { user, tokens };
}

module.exports = { register, login };

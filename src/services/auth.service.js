// src/services/auth.service.js
const User = require('../models/user.model');
const { signAccess, signRefresh, verifyRefresh } = require('../utils/token.util');

async function register({ name, email, password, role }) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already exists');
  const user = await User.create({ name, email, password, role });
 
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

async function login({ email, password }, res) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const match = await user.comparePassword(password);
  if (!match) throw new Error('Invalid credentials');

  const payload = { id: user._id.toString(), role: user.role };
  const accessToken = signAccess(payload);
  const refreshToken = signRefresh(payload);

  // also return in JSON for Postman, and set signed cookies
  res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax', signed: true });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', signed: true });

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    tokens: { access: accessToken, refresh: refreshToken },
  };
}

async function refresh(req, res) {
  const token = req.signedCookies?.refreshToken || req.cookies?.refreshToken;
  if (!token) throw new Error('No refresh token');

  const payload = verifyRefresh(token);
  const accessToken = signAccess({ id: payload.id, role: payload.role });
  const refreshToken = signRefresh({ id: payload.id, role: payload.role });

  res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax', signed: true });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', signed: true });

  return { access: accessToken, refresh: refreshToken };
}

async function logout(res) {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return { success: true };
}

module.exports = { register, login, refresh, logout };

// src/utils/token.util.js
const jwt = require('jsonwebtoken');

const accessSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'access_secret';
const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET || 'refresh_secret';
const accessExpires = process.env.JWT_ACCESS_EXPIRES_IN || '1h';
const refreshExpires = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

function signAccess(payload) {
  return jwt.sign(payload, accessSecret, { expiresIn: accessExpires });
}

function signRefresh(payload) {
  return jwt.sign(payload, refreshSecret, { expiresIn: refreshExpires });
}

function verifyAccess(token) {
  return jwt.verify(token, accessSecret);
}

function verifyRefresh(token) {
  return jwt.verify(token, refreshSecret);
}

function getTokenFromHeader(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  // Signed cookie support
  if (req.signedCookies && req.signedCookies.accessToken) return req.signedCookies.accessToken;
  if (req.cookies && req.cookies.accessToken) return req.cookies.accessToken;
  return null;
}

module.exports = {
  signAccess,
  signRefresh,
  verifyAccess,
  verifyRefresh,
  getTokenFromHeader,
};

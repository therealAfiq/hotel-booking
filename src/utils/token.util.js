// src/utils/token.util.js
const jwt = require('jsonwebtoken');
const config = require('../config');

const {
  accessSecret,
  refreshSecret,
  accessExpires,
  refreshExpires,
} = config.jwt;

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

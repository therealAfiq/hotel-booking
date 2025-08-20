// src/controllers/auth.controller.js
const authService = require('../services/auth.service');

async function register(req, res) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function login(req, res) {
  try {
    const result = await authService.login(req.body, res);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function refresh(req, res) {
  try {
    const tokens = await authService.refresh(req, res);
    res.json({ tokens });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

async function logout(req, res) {
  try {
    await authService.logout(res);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = { register, login, refresh, logout };

// src/controllers/auth.controller.js
const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const { user, tokens } = await authService.register(name, email, password, role);

    // Set cookie for browser usage
    res.cookie('token', tokens.access.token, {
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.status(201).json({ user, tokens });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, tokens } = await authService.login(email, password);

    // Set cookie for browser usage
    res.cookie('token', tokens.access.token, {
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.status(200).json({ user, tokens });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { register, login };

// src/controllers/user.controller.js
const userService = require('../services/user.service');

async function getMe(req, res) {
  try {
    const user = await userService.getProfile(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function listUsers(req, res) {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateUserRole(req, res) {
  try {
    const user = await userService.updateUserRole(req.params.id, req.body.role);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = { getMe, listUsers, updateUserRole };

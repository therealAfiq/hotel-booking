// src/services/user.service.js
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

async function getProfile(userId) {
  return User.findById(userId).select('-password');
}

async function updateProfile(userId, updateData) {
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }
  return User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
}

async function listUsers() {
  return User.find().select('-password');
}

async function updateUserRole(id, role) {
  return User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
}

module.exports = { getProfile, updateProfile, listUsers, updateUserRole };

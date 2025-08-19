const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { signAccess, signRefresh } = require('../utils/token.util');

// ✅ Generate access + refresh tokens
function generateTokens(user) {
  const payload = { id: user._id, role: user.role };
  return {
    accessToken: signAccess(payload),
    refreshToken: signRefresh(payload),
  };
}

// Register
async function registerUser({ name, email, password, role }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already exists');

  const user = await User.create({ name, email, password, role });
  const tokens = generateTokens(user);

  return { user: { id: user._id, name: user.name, role: user.role }, tokens };
}

// Login
async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid credentials');

  const tokens = generateTokens(user);
  return { user: { id: user._id, name: user.name, role: user.role }, tokens };
}

// Profile
async function getProfile(userId) {
  return User.findById(userId).select('-password -refreshToken');
}

async function updateProfile(userId, updateData) {
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }
  return User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password -refreshToken');
}

// Admin helpers
async function listUsers() {
  return User.find().select('-password -refreshToken');
}

async function getUserByIdAdmin(id) {
  return User.findById(id).select('-password -refreshToken');
}

async function deleteUser(id) {
  return User.findByIdAndDelete(id);
}

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  listUsers,
  getUserByIdAdmin,
  deleteUser,
};

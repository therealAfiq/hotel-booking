// src/services/room.service.js
const Room = require('../models/room.model');

async function createRoom(data) {
  return Room.create(data);
}
async function listRooms() {
  return Room.find().sort({ createdAt: -1 });
}
async function getRoomById(id) {
  return Room.findById(id);
}
async function updateRoom(id, data) {
  return Room.findByIdAndUpdate(id, data, { new: true });
}
async function deleteRoom(id) {
  return Room.findByIdAndDelete(id);
}

module.exports = { createRoom, listRooms, getRoomById, updateRoom, deleteRoom };

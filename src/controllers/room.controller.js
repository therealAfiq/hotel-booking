// src/controllers/room.controller.js
const roomService = require('../services/room.service');

async function createRoom(req, res) {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
async function listRooms(req, res) {
  try {
    const rooms = await roomService.listRooms();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
async function getRoomById(req, res) {
  try {
    const room = await roomService.getRoomById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
async function updateRoom(req, res) {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
async function deleteRoom(req, res) {
  try {
    const room = await roomService.deleteRoom(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = { createRoom, listRooms, getRoomById, updateRoom, deleteRoom };

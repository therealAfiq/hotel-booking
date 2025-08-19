const roomService = require('../services/room.service');

async function createRoom(req, res) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getRooms(req, res) {
  try {
    const rooms = await roomService.listRooms();
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createRoom, getRooms };

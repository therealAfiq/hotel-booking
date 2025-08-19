const Room = require('../models/room.model');

async function createRoom(data) {
  const room = new Room(data);
  await room.save();
  return room;
}

async function listRooms() {
  return Room.find({});
}

module.exports = { createRoom, listRooms };

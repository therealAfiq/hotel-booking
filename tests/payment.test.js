const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { adminToken, userToken } = require('./auth.test');
const Booking = require('../src/models/booking.model');
const Room = require('../src/models/room.model');

let bookingId, testRoomId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);

  const room = await Room.create({ name: 'Payment Room', price: 150, capacity: 2 });
  testRoomId = room._id;

  const booking = await Booking.create({
    room: testRoomId,
    user: mongoose.Types.ObjectId(),
    checkIn: '2025-08-20',
    checkOut: '2025-08-22',
  });
  bookingId = booking._id;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Payment API', () => {
  it('should create a checkout session', async () => {
    const res = await request(app)
      .post('/api/v1/payments/checkout')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ bookingId });
    expect(res.statusCode).toBe(200);
    expect(res.body.url).toBeDefined();
  });
});

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { adminToken, userToken } = require('./auth.test');
const Room = require('../src/models/room.model');

let bookingId, testRoomId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);

  const room = await Room.create({ name: 'Test Room', price: 100, capacity: 2 });
  testRoomId = room._id;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Booking API', () => {
  it('should allow a user to create a booking', async () => {
    const res = await request(app)
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ roomId: testRoomId, checkIn: '2025-08-20', checkOut: '2025-08-22' });
    expect(res.statusCode).toBe(201);
    bookingId = res.body._id;
  });

  it('should allow user to fetch their bookings', async () => {
    const res = await request(app)
      .get('/api/v1/bookings')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.some(b => b._id === bookingId)).toBe(true);
  });

  it('should allow admin to fetch all bookings', async () => {
    const res = await request(app)
      .get('/api/v1/bookings')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should allow user to cancel their booking', async () => {
    const res = await request(app)
      .delete(`/api/v1/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
  });
});

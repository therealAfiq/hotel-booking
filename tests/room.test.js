const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { adminToken, userToken } = require('./auth.test');

let roomId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Room API', () => {
  it('should allow admin to create a room', async () => {
    const res = await request(app)
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Deluxe Room', price: 200, capacity: 2 });
    expect(res.statusCode).toBe(201);
    roomId = res.body._id;
  });

  it('should forbid normal user from creating room', async () => {
    const res = await request(app)
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Suite', price: 400, capacity: 3 });
    expect(res.statusCode).toBe(403);
  });

  it('should allow anyone to list rooms', async () => {
    const res = await request(app).get('/api/v1/rooms');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

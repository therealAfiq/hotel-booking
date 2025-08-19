const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user.model');

let adminToken, userToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Auth API', () => {
  it('should register an admin', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.role).toBe('admin');
    expect(res.body.tokens.access).toBeDefined();
    adminToken = res.body.tokens.access.token;
  });

  it('should register a normal user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'User',
        email: 'user@example.com',
        password: 'password123',
        role: 'user',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.role).toBe('user');
    expect(res.body.tokens.access).toBeDefined();
    userToken = res.body.tokens.access.token;
  });

  it('should login the admin', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.tokens.access.token).toBeDefined();
    adminToken = res.body.tokens.access.token;
  });

  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'user@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.tokens.access.token).toBeDefined();
    userToken = res.body.tokens.access.token;
  });
});

module.exports = { adminToken, userToken };

// tests/admin.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user.model');
const { signAccess } = require('../src/utils/token.util');

describe('Admin Routes', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    // Clean DB
    await User.deleteMany({});

    // Create an admin user directly in DB
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@example.com',
      password: 'AdminPass123!',
      role: 'admin',
    });

    // Create a normal user directly in DB
    const user = await User.create({
      name: 'Normal User',
      email: 'user@example.com',
      password: 'UserPass123!',
      role: 'user',
    });

    // Generate tokens for both
    adminToken = signAccess({ id: admin._id, role: 'admin' });
    userToken = signAccess({ id: user._id, role: 'user' });
  });

 
  describe('POST /api/v1/admin/register', () => {
    it('should allow admin to register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/admin/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'NewUserPass123!',
          role: 'user',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe('newuser@example.com');
      expect(res.body.user.role).toBe('user');
    });

    it('should forbid normal users from registering new users', async () => {
      const res = await request(app)
        .post('/api/v1/admin/register')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Fake Admin',
          email: 'fakeadmin@example.com',
          password: 'FakePass123!',
          role: 'admin',
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/Forbidden/i);
    });

    it('should reject if no token is provided', async () => {
      const res = await request(app)
        .post('/api/v1/admin/register')
        .send({
          name: 'No Token User',
          email: 'notoken@example.com',
          password: 'NoTokenPass123!',
          role: 'user',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/Unauthorized/i);
    });
  });
});

const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const { signAccess } = require('../src/utils/token.util');

let adminToken;
let userToken;

beforeAll(async () => {
  // Make sure admin exists
  const admin = await User.findOne({ email: process.env.SEED_ADMIN_EMAIL });
  if (!admin) throw new Error('Admin not found in DB!');
  adminToken = signAccess({ userId: admin._id, role: 'admin' });

  // Create a normal user
  const user = await User.create({
    name: 'Normal User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
  });
  userToken = signAccess({ userId: user._id, role: 'user' });
});

describe('Admin Routes', () => {
  it('should forbid non-admin from accessing /api/v1/admin/users', async () => {
    const res = await request(app)
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  it('should return all users when accessed by admin', async () => {
    const res = await request(app)
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should reject unauthenticated requests', async () => {
    const res = await request(app).get('/api/v1/admin/users');
    expect(res.statusCode).toBe(401);
  });
});

const request = require('supertest');
const app = require('../src/app'); // your Express app
const mongoose = require('mongoose');

describe('Health Endpoints', () => {
  it('should respond to /api/ping', async () => {
    const res = await request(app).get('/api/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'pong' });
  });

  it('should respond to /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('db');
  });
});

// No mongoose.connect() here! It uses the existing connection from your setupAfterEnv.js

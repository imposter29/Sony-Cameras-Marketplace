const request = require('supertest');
const app = require('../app');
const User = require('../models/User.model');
const { connect, clearDatabase, closeDatabase } = require('./helpers');

beforeAll(connect);
afterEach(clearDatabase);
afterAll(closeDatabase);

describe('Auth', () => {
  test('registers a new user and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'secret123',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe('alice@example.com');
  });

  test('rejects duplicate email registration with 400', async () => {
    const payload = { name: 'Bob', email: 'bob@example.com', password: 'secret123' };
    await request(app).post('/api/auth/register').send(payload);
    const res = await request(app).post('/api/auth/register').send(payload);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('rejects registration with invalid email (validation)', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Bad',
      email: 'not-an-email',
      password: 'secret123',
    });
    expect(res.status).toBe(400);
  });

  test('logs in with correct credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Carol',
      email: 'carol@example.com',
      password: 'secret123',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'carol@example.com',
      password: 'secret123',
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  test('rejects wrong password with 401', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Dan',
      email: 'dan@example.com',
      password: 'secret123',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'dan@example.com',
      password: 'wrongpass',
    });
    expect(res.status).toBe(401);
  });

  test('Google-account user attempting password login gets a clean 400 (not 500)', async () => {
    // Simulate a Google user with no password.
    await User.create({
      name: 'Grace',
      email: 'grace@example.com',
      googleId: 'google-123',
      authProvider: 'google',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'grace@example.com',
      password: 'anything',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Google/i);
  });

  test('set-password lets a Google user log in with email/password afterwards', async () => {
    const gUser = await User.create({
      name: 'Heidi',
      email: 'heidi@example.com',
      googleId: 'google-456',
      authProvider: 'google',
    });
    const token = require('jsonwebtoken').sign(
      { id: gUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const setRes = await request(app)
      .post('/api/auth/set-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'newsecret1' });
    expect(setRes.status).toBe(200);

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'heidi@example.com',
      password: 'newsecret1',
    });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeTruthy();
  });
});

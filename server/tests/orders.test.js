const request = require('supertest');
const app = require('../app');
const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Cart = require('../models/Cart.model');
const Order = require('../models/Order.model');
const { connect, clearDatabase, closeDatabase } = require('./helpers');

beforeAll(connect);
afterEach(clearDatabase);
afterAll(closeDatabase);

// Register a user and return { token, user }.
const registerUser = async (email) => {
  const res = await request(app).post('/api/auth/register').send({
    name: email.split('@')[0],
    email,
    password: 'secret123',
  });
  return { token: res.body.token, user: res.body.user };
};

const makeProduct = (stock, overrides = {}) =>
  Product.create({
    name: 'Sony A7 IV',
    slug: `sony-a7-${Math.random().toString(36).slice(2)}`,
    description: 'Full-frame camera',
    price: 1000,
    stock,
    category: new (require('mongoose').Types.ObjectId)(),
    images: ['https://example.com/a7.jpg'],
    ...overrides,
  });

const address = {
  label: 'Home',
  line1: '1 Main St',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  phone: '9999999999',
};

describe('Place order', () => {
  test('decrements product stock by the ordered quantity', async () => {
    const { token, user } = await registerUser('order1@example.com');
    const product = await makeProduct(5);
    await Cart.create({ user: user._id, items: [{ product: product._id, quantity: 2 }] });

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ shippingAddress: address, paymentMethod: 'cod' });

    expect(res.status).toBe(201);
    expect(res.body.order.total).toBe(2000);

    const updated = await Product.findById(product._id);
    expect(updated.stock).toBe(3);

    // Cart is cleared after a successful order.
    const cart = await Cart.findOne({ user: user._id });
    expect(cart.items.length).toBe(0);
  });

  test('rejects order when stock is insufficient and does not decrement', async () => {
    const { token, user } = await registerUser('order2@example.com');
    const product = await makeProduct(1);
    await Cart.create({ user: user._id, items: [{ product: product._id, quantity: 3 }] });

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ shippingAddress: address, paymentMethod: 'cod' });

    expect(res.status).toBe(400);
    const updated = await Product.findById(product._id);
    expect(updated.stock).toBe(1); // untouched
  });

  test('concurrent orders for the last unit cannot oversell', async () => {
    const product = await makeProduct(1);
    const a = await registerUser('racea@example.com');
    const b = await registerUser('raceb@example.com');
    await Cart.create({ user: a.user._id, items: [{ product: product._id, quantity: 1 }] });
    await Cart.create({ user: b.user._id, items: [{ product: product._id, quantity: 1 }] });

    const place = (token) =>
      request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({ shippingAddress: address, paymentMethod: 'cod' });

    const [r1, r2] = await Promise.all([place(a.token), place(b.token)]);

    const statuses = [r1.status, r2.status].sort();
    expect(statuses).toEqual([201, 400]); // exactly one succeeds

    const updated = await Product.findById(product._id);
    expect(updated.stock).toBe(0); // never negative

    const orderCount = await Order.countDocuments();
    expect(orderCount).toBe(1);
  });

  test('admin cancelling an order restores stock', async () => {
    const { token, user } = await registerUser('cancel@example.com');
    // Make this user an admin.
    await User.findByIdAndUpdate(user._id, { role: 'admin' });
    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'cancel@example.com',
      password: 'secret123',
    });
    const adminToken = adminLogin.body.token;

    const product = await makeProduct(5);
    await Cart.create({ user: user._id, items: [{ product: product._id, quantity: 2 }] });

    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ shippingAddress: address, paymentMethod: 'cod' });
    expect(orderRes.status).toBe(201);
    expect((await Product.findById(product._id)).stock).toBe(3);

    const cancelRes = await request(app)
      .patch(`/api/orders/${orderRes.body.order._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'cancelled' });
    expect(cancelRes.status).toBe(200);

    // Stock restored to original.
    expect((await Product.findById(product._id)).stock).toBe(5);
  });

  test('rejects illegal status transition (delivered -> placed)', async () => {
    const { token, user } = await registerUser('trans@example.com');
    await User.findByIdAndUpdate(user._id, { role: 'admin' });
    const login = await request(app).post('/api/auth/login').send({
      email: 'trans@example.com',
      password: 'secret123',
    });
    const adminToken = login.body.token;

    const product = await makeProduct(5);
    await Cart.create({ user: user._id, items: [{ product: product._id, quantity: 1 }] });
    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ shippingAddress: address, paymentMethod: 'cod' });
    const orderId = orderRes.body.order._id;

    // Drive it to delivered through legal steps.
    for (const status of ['confirmed', 'shipped', 'out_for_delivery', 'delivered']) {
      const r = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status });
      expect(r.status).toBe(200);
    }

    const bad = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'placed' });
    expect(bad.status).toBe(400);
  });
});

const request = require('supertest');
const app = require('../app');
const Product = require('../models/Product.model');
const { connect, clearDatabase, closeDatabase } = require('./helpers');

beforeAll(connect);
afterEach(clearDatabase);
afterAll(closeDatabase);

const registerUser = async (email) => {
  const res = await request(app).post('/api/auth/register').send({
    name: email.split('@')[0],
    email,
    password: 'secret123',
  });
  return res.body.token;
};

const makeProduct = (stock) =>
  Product.create({
    name: 'Sony ZV-1',
    slug: `zv1-${Math.random().toString(36).slice(2)}`,
    description: 'Vlog camera',
    price: 500,
    stock,
    category: new (require('mongoose').Types.ObjectId)(),
    images: ['https://example.com/zv1.jpg'],
  });

describe('Cart merge-on-login contract', () => {
  // The client mergeGuestCart() replays each guest item through POST /cart/add.
  // That endpoint must SUM quantities for a repeated product (respecting stock),
  // which is what makes the merge correct.
  test('adding the same product twice sums the quantity', async () => {
    const token = await registerUser('cart1@example.com');
    const product = await makeProduct(10);

    await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, quantity: 1 });

    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, quantity: 2 });

    expect(res.status).toBe(200);
    expect(res.body.cart.items).toHaveLength(1);
    expect(res.body.cart.items[0].quantity).toBe(3);
    // Cart is returned populated so the client can hydrate its flat shape.
    expect(res.body.cart.items[0].product.name).toBe('Sony ZV-1');
  });

  test('merging beyond available stock is rejected', async () => {
    const token = await registerUser('cart2@example.com');
    const product = await makeProduct(2);

    await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, quantity: 2 });

    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, quantity: 1 });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/stock/i);
  });

  test('GET /cart hydrates an empty cart for a new user', async () => {
    const token = await registerUser('cart3@example.com');
    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.cart.items).toEqual([]);
  });
});

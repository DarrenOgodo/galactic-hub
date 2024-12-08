const request = require('supertest');
const assert = require('assert')
const app = require('../server');

// Test for /login endpoint
describe('POST /login', () => {
  it('responds with a successful login', async function() {
    const res = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .set('Accept', 'application/json');

    assert.equal(res.status, 200);
    assert.equal(res.type, 'application/json');
    assert.equal(res.body.message, 'Login successful!');
    assert.ok(res.body.user); // Check if user ID is present in the response
  });

  it('responds with a login failure', async function() {
    const res = await request(app)
      .post('/login')
      .send({ email: 'wrong@example.com', password: 'wrongpassword' })
      .set('Accept', 'application/json');

    assert.equal(res.status, 400);
    assert.equal(res.type, 'application/json');
    assert.equal(res.body.message, 'Login unsuccessful!');
  });
});

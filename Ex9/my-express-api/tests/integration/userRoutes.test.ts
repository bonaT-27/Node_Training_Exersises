import request from 'supertest';
import app from '../../src/app.js';
import { describe, it, expect } from 'vitest';

describe('User API', () => {
  it('GET /api/users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/users/:id', async () => {
    const res = await request(app).get('/api/users/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  it('GET /api/users/:id invalid', async () => {
    const res = await request(app).get('/api/users/0');
    expect(res.status).toBe(400);
  });
});
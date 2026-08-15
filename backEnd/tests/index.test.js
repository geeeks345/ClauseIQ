import request from 'supertest';
import app from '../index.js';

describe('API Routes', function() {
  describe('GET /', function() {
    it('Should return API running message', async function() {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('API is running...');
    });

    it('Should return plain text response type', async function() {
      const response = await request(app).get('/');
      expect(response.headers['content-type']).toContain('text/html');
    });
  });

  describe('GET /unknown-route', function() {
    it('Should return 404 for unknown route', async function() {
      const response = await request(app).get('/unknown-route');
      expect(response.status).toBe(404);
    });
  });
});
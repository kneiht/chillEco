import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

describe('Users Service', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
  });

  describe('Health Endpoint', () => {
    it('should return 200 OK with correct service info', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body).toEqual({
        status: 'ok',
        service: 'users',
      });
    });

    it('should have correct content type', async () => {
      const response = await request(app).get('/api/health').expect('Content-Type', /json/);

      expect(response.status).toBe(200);
    });
  });

  describe('App Configuration', () => {
    it('should parse JSON requests', async () => {
      // Test that the app can handle JSON requests
      const testData = { test: 'data' };

      // Add a temporary POST endpoint for testing JSON parsing
      app.post('/test-json', (req, res) => {
        res.json({ received: req.body });
      });

      const response = await request(app).post('/test-json').send(testData).expect(200);

      expect(response.body.received).toEqual(testData);
    });

    it('should create app with middleware', () => {
      expect(app).toBeDefined();
      expect(typeof app.use).toBe('function');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      await request(app).get('/nonexistent').expect(404);
    });
  });
});

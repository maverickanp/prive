import request from 'supertest';
import app from '@/main/app';

describe('API Health Check', () => {
  it('should return 404 for undefined routes', async () => {
    const response = await request(app).get('/undefined-route');
    expect(response.status).toBe(404);
  });

  it('should handle invalid JSON in request body', async () => {
    const response = await request(app)
      .post('/api/ride/estimate')
      .set('Content-Type', 'application/json')
      .send('invalid json');

    expect(response.status).toBe(400);
  });
});
import request from 'supertest';
import { AppDataSource } from '@/infrastructure/config/database';
import app from '@/main/app';

describe('Ride Routes', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe('POST /api/ride/estimate', () => {
    it('should return 400 when customer_id is not provided', async () => {
      const response = await request(app)
        .post('/api/ride/estimate')
        .send({
          origin: 'Test Origin',
          destination: 'Test Destination'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error_code', 'INVALID_DATA');
    });

    it('should return estimate when all data is valid', async () => {
      const response = await request(app)
        .post('/api/ride/estimate')
        .send({
          customer_id: '123',
          origin: 'Av Paulista, São Paulo',
          destination: 'Pinheiros, São Paulo'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('options');
      expect(response.body).toHaveProperty('distance');
      expect(response.body).toHaveProperty('duration');
    });
  });
});
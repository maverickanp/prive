import request from 'supertest';
import { TestDataSource } from '@/infrastructure/config/database.test';
import app from '@/main/app';
import { Driver } from '@/infrastructure/database/entities/Driver';

describe('Ride Endpoints', () => {
  beforeEach(async () => {
    // Limpa e recria os dados de teste
    await TestDataSource.getRepository(Driver).clear();
    await TestDataSource.getRepository(Driver).save([
      {
        id: 1,
        name: 'Homer Simpson',
        description: 'Test description',
        vehicle: 'Plymouth Valiant 1973',
        rating: 2,
        pricePerKm: 2.50,
        minKmRequired: 1,
        rides: []
      },
      {
        id: 2,
        name: 'Dominic Toretto',
        description: 'Test description',
        vehicle: 'Dodge Charger R/T 1970',
        rating: 4,
        pricePerKm: 5.00,
        minKmRequired: 5,
        rides: []
      }
    ]);
  });

  const validCustomerId = 'test-customer';

  describe('POST /api/ride/estimate', () => {
    const validPayload = {
      customer_id: validCustomerId,
      origin: 'Av Paulista, São Paulo',
      destination: 'Pinheiros, São Paulo'
    };

    it('should validate required fields', async () => {
      const invalidPayloads = [
        { ...validPayload, customer_id: '' },
        { ...validPayload, origin: '' },
        { ...validPayload, destination: '' }
      ];

      for (const payload of invalidPayloads) {
        const response = await request(app)
          .post('/api/ride/estimate')
          .send(payload);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error_code', 'INVALID_DATA');
      }
    });

    it('should return estimate with valid data', async () => {
      const response = await request(app)
        .post('/api/ride/estimate')
        .send(validPayload);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('distance');
      expect(response.body).toHaveProperty('duration');
      expect(response.body).toHaveProperty('options');
      expect(response.body.options).toBeInstanceOf(Array);
    });
  });

  describe('PATCH /api/ride/confirm', () => {
    let estimateData: any;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/ride/estimate')
        .send({
          customer_id: validCustomerId,
          origin: 'Av Paulista, São Paulo',
          destination: 'Pinheiros, São Paulo'
        });

      estimateData = response.body;
    });

    it('should confirm ride with valid data', async () => {
      const firstOption = estimateData.options[0];
      
      const response = await request(app)
        .patch('/api/ride/confirm')
        .send({
          customer_id: validCustomerId,
          origin: 'Av Paulista, São Paulo',
          destination: 'Pinheiros, São Paulo',
          distance: estimateData.distance,
          duration: estimateData.duration,
          driver: {
            id: firstOption.id,
            name: firstOption.name
          },
          value: firstOption.value
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });
  });

  describe('GET /api/ride/:customer_id', () => {
    it('should list rides for customer', async () => {
      const response = await request(app)
        .get(`/api/ride/${validCustomerId}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('customer_id', validCustomerId);
      expect(response.body).toHaveProperty('rides');
      expect(response.body.rides).toBeInstanceOf(Array);
    });

    it('should filter rides by driver', async () => {
      const driverId = 1;
      const response = await request(app)
        .get(`/api/ride/${validCustomerId}?driver_id=${driverId}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.rides).toBeInstanceOf(Array);
      response.body.rides.forEach((ride: any) => {
        expect(ride.driver.id).toBe(driverId);
      });
    });
  });
});
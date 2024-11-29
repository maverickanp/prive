import request from 'supertest';
import { AppDataSource } from '@/infrastructure/config/database';
import app from '@/main/app';

describe('Ride Integration Tests', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  const testCustomerId = 'test-customer-123';

  describe('Complete ride flow', () => {
    it('should complete full ride cycle: estimate -> confirm -> list', async () => {
      // 1. Estimate
      const estimateResponse = await request(app)
        .post('/api/ride/estimate')
        .send({
          customer_id: testCustomerId,
          origin: 'Av Paulista, São Paulo',
          destination: 'Pinheiros, São Paulo'
        });

      expect(estimateResponse.status).toBe(200);
      expect(estimateResponse.body).toHaveProperty('options');
      expect(estimateResponse.body.options.length).toBeGreaterThan(0);

      const firstOption = estimateResponse.body.options[0];
      const { distance, duration } = estimateResponse.body;

      // 2. Confirm
      const confirmResponse = await request(app)
        .patch('/api/ride/confirm')
        .send({
          customer_id: testCustomerId,
          origin: 'Av Paulista, São Paulo',
          destination: 'Pinheiros, São Paulo',
          distance,
          duration,
          driver: {
            id: firstOption.id,
            name: firstOption.name
          },
          value: firstOption.value
        });

      expect(confirmResponse.status).toBe(200);
      expect(confirmResponse.body).toEqual({ success: true });

      // 3. List
      const listResponse = await request(app)
        .get(`/api/ride/${testCustomerId}`)
        .send();

      expect(listResponse.status).toBe(200);
      expect(listResponse.body).toHaveProperty('customer_id', testCustomerId);
      expect(listResponse.body.rides).toBeInstanceOf(Array);
      expect(listResponse.body.rides.length).toBeGreaterThan(0);

      const lastRide = listResponse.body.rides[0];
      expect(lastRide).toMatchObject({
        origin: 'Av Paulista, São Paulo',
        destination: 'Pinheiros, São Paulo',
        distance: expect.any(Number),
        duration,
        value: expect.any(Number),
        driver: {
          id: firstOption.id,
          name: firstOption.name
        }
      });      
    });

    it('should filter rides by driver', async () => {
      // Primeiro, lista todas as viagens
      const allRidesResponse = await request(app)
        .get(`/api/ride/${testCustomerId}`)
        .send();

      expect(allRidesResponse.status).toBe(200);
      
      const firstRide = allRidesResponse.body.rides[0];
      const driverId = firstRide.driver.id;

      // Depois, filtra por motorista
      const filteredResponse = await request(app)
        .get(`/api/ride/${testCustomerId}?driver_id=${driverId}`)
        .send();

      expect(filteredResponse.status).toBe(200);
      expect(filteredResponse.body.rides).toBeInstanceOf(Array);
      expect(filteredResponse.body.rides.length).toBeGreaterThan(0);
      expect(filteredResponse.body.rides.every((ride: any) => ride.driver.id === driverId)).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should handle invalid customer_id in estimate', async () => {
      const response = await request(app)
        .post('/api/ride/estimate')
        .send({
          customer_id: '',
          origin: 'Av Paulista, São Paulo',
          destination: 'Pinheiros, São Paulo'
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error_code: 'INVALID_DATA',
        error_description: expect.any(String)
      });
    });

    it('should handle invalid driver in confirm', async () => {
      const response = await request(app)
        .patch('/api/ride/confirm')
        .send({
          customer_id: testCustomerId,
          origin: 'Av Paulista, São Paulo',
          destination: 'Pinheiros, São Paulo',
          distance: 5,
          duration: '15 mins',
          driver: {
            id: 999999,
            name: 'Invalid Driver'
          },
          value: 25.00
        });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error_code: 'DRIVER_NOT_FOUND',
        error_description: expect.any(String)
      });
    });

    it('should handle invalid distance for driver', async () => {
      // Primeiro, faz uma estimativa para pegar um motorista válido
      const estimateResponse = await request(app)
        .post('/api/ride/estimate')
        .send({
          customer_id: testCustomerId,
          origin: 'Av Paulista, São Paulo',
          destination: 'Pinheiros, São Paulo'
        });

      const firstOption = estimateResponse.body.options[0];

      // Tenta confirmar com uma distância muito pequena
      const response = await request(app)
        .patch('/api/ride/confirm')
        .send({
          customer_id: testCustomerId,
          origin: 'Av Paulista, São Paulo',
          destination: 'Pinheiros, São Paulo',
          distance: 0.5,
          duration: '15 mins',
          driver: {
            id: firstOption.id,
            name: firstOption.name
          },
          value: firstOption.value
        });

      expect(response.status).toBe(406);
      expect(response.body).toMatchObject({
        error_code: 'INVALID_DISTANCE',
        error_description: expect.any(String)
      });
    });
  });
});
import request from 'supertest';
import app from '@/main/app';
import { setupTestDatabase, clearTestDatabase, closeTestDatabase } from '../helpers/database';

describe('Ride Flow Integration', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterEach(async () => {
    await clearTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  const testFlow = async () => {
    const customerId = 'test-customer-123';
    
    // 1. Estimativa
    const estimateResponse = await request(app)
      .post('/api/ride/estimate')
      .send({
        customer_id: customerId,
        origin: 'Av Paulista, São Paulo',
        destination: 'Pinheiros, São Paulo'
      });

    expect(estimateResponse.status).toBe(200);
    expect(estimateResponse.body.options.length).toBeGreaterThan(0);

    const estimateData = estimateResponse.body;
    const selectedDriver = estimateData.options[0];

    // 2. Confirmação
    const confirmResponse = await request(app)
      .patch('/api/ride/confirm')
      .send({
        customer_id: customerId,
        origin: 'Av Paulista, São Paulo',
        destination: 'Pinheiros, São Paulo',
        distance: estimateData.distance,
        duration: estimateData.duration,
        driver: {
          id: selectedDriver.id,
          name: selectedDriver.name
        },
        value: selectedDriver.value
      });

    expect(confirmResponse.status).toBe(200);
    expect(confirmResponse.body.success).toBe(true);

    // 3. Verificação do histórico
    const historyResponse = await request(app)
      .get(`/api/ride/${customerId}`)
      .send();

    expect(historyResponse.status).toBe(200);
    expect(historyResponse.body.rides).toHaveLength(1);

    const savedRide = historyResponse.body.rides[0];
    expect(savedRide).toMatchObject({
      origin: 'Av Paulista, São Paulo',
      destination: 'Pinheiros, São Paulo',
      distance: estimateData.distance,
      value: selectedDriver.value,
      driver: {
        id: selectedDriver.id,
        name: selectedDriver.name
      }
    });

    // 4. Verificação do filtro por motorista
    const filteredResponse = await request(app)
      .get(`/api/ride/${customerId}?driver_id=${selectedDriver.id}`)
      .send();

    expect(filteredResponse.status).toBe(200);
    expect(filteredResponse.body.rides).toHaveLength(1);
    expect(filteredResponse.body.rides[0].driver.id).toBe(selectedDriver.id);
  };

  it('should complete full ride flow successfully', testFlow);

  // Testes de erro
  it('should handle invalid data in estimate', async () => {
    const response = await request(app)
      .post('/api/ride/estimate')
      .send({
        customer_id: '',
        origin: '',
        destination: ''
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error_code', 'INVALID_DATA');
  });

  it('should handle invalid driver in confirm', async () => {
    const response = await request(app)
      .patch('/api/ride/confirm')
      .send({
        customer_id: 'test-customer',
        origin: 'Origin',
        destination: 'Destination',
        distance: 5,
        duration: '15 mins',
        driver: {
          id: 999,
          name: 'Invalid Driver'
        },
        value: 25
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error_code', 'DRIVER_NOT_FOUND');
  });
});
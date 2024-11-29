import { AppDataSource } from '@/infrastructure/config/database';
import { DriverRepository } from '@/infrastructure/database/repositories/DriverRepository';
import { RideRepository } from '@/infrastructure/database/repositories/RideRepository';
import { Driver } from '@/infrastructure/database/entities/Driver';
import { Ride } from '@/infrastructure/database/entities/Ride';

describe('Database Integration Tests', () => {
  let driverRepository: DriverRepository;
  let rideRepository: RideRepository;

  beforeAll(async () => {
    await AppDataSource.initialize();
    driverRepository = new DriverRepository();
    rideRepository = new RideRepository();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe('DriverRepository', () => {
    it('should find driver by id', async () => {
      const driver = await driverRepository.findById(1);
      expect(driver).toBeDefined();
      expect(driver?.id).toBe(1);
      expect(driver?.name).toBe('Homer Simpson');
    });

    it('should find drivers by minimum distance', async () => {
      const distance = 3;
      const drivers = await driverRepository.findByMinimumDistance(distance);
      
      expect(drivers.length).toBeGreaterThan(0);
      drivers.forEach(driver => {
        expect(driver.minKmRequired).toBeLessThanOrEqual(distance);
      });
    });
  });

  describe('RideRepository', () => {
    let testDriver: Driver;
    let testRide: Ride;

    beforeAll(async () => {
      testDriver = await driverRepository.findById(1) as Driver;
    });

    it('should save a new ride', async () => {
      const rideData = {
        customerId: 'test-customer',
        origin: 'Test Origin',
        destination: 'Test Destination',
        distance: 5,
        duration: '15 mins',
        value: 25.00,
        driver: testDriver,
        originLatitude: -23.55,
        originLongitude: -46.63,
        destinationLatitude: -23.56,
        destinationLongitude: -46.64
      };

      testRide = await rideRepository.save(rideData);

      expect(testRide.id).toBeDefined();
      expect(testRide.customerId).toBe(rideData.customerId);
      expect(testRide.driver.id).toBe(testDriver.id);
    });

    it('should find rides by customer id', async () => {
      const rides = await rideRepository.findByCustomerId('test-customer');
      
      expect(rides.length).toBeGreaterThan(0);
      expect(rides[0].customerId).toBe('test-customer');
    });

    it('should find rides filtered by driver', async () => {
      const rides = await rideRepository.findByCustomerId('test-customer', testDriver.id);
      
      expect(rides.length).toBeGreaterThan(0);
      rides.forEach(ride => {
        expect(ride.driver.id).toBe(testDriver.id);
      });
    });
  });
});
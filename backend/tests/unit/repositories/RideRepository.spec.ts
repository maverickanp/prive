import { TestDataSource } from '@/infrastructure/config/database.test';
import { Driver } from '@/infrastructure/database/entities/Driver';
import { RideRepository } from '@/infrastructure/database/repositories/RideRepository';

describe('RideRepository Tests', () => {
  let rideRepository: RideRepository;
  let testDriver: Driver;

  beforeEach(async () => {
    rideRepository = new RideRepository();

    testDriver = await TestDataSource.getRepository(Driver).save({
      id: 1,
      name: 'Test Driver',
      description: 'Test Description',
      vehicle: 'Test Vehicle',
      rating: 5,
      pricePerKm: 2.5,
      minKmRequired: 1,
      rides: []
    });
  });

  it('should save ride', async () => {
    const ride = await rideRepository.save({
      customerId: 'test-customer',
      origin: 'Test Origin',
      destination: 'Test Destination',
      distance: 10,
      duration: '30 mins',
      driver: testDriver,
      value: 25.00,
      originLatitude: -23.55,
      originLongitude: -46.63,
      destinationLatitude: -23.56,
      destinationLongitude: -46.64
    });

    expect(ride.id).toBeDefined();
    expect(ride.driver.id).toBe(testDriver.id);
  });
});
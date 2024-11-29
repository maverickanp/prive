import { TestDataSource } from '@/infrastructure/config/database.test';
import { Driver } from '@/infrastructure/database/entities/Driver';
import { DriverRepository } from '@/infrastructure/database/repositories/DriverRepository';

describe('DriverRepository Tests', () => {
  let driverRepository: DriverRepository;

  beforeEach(async () => {
    driverRepository = new DriverRepository();
  });

  it('should find by id', async () => {
    const driver = await TestDataSource.getRepository(Driver).save({
      id: 1,
      name: 'Test Driver',
      description: 'Test Description',
      vehicle: 'Test Vehicle',
      rating: 5,
      pricePerKm: 2.5,
      minKmRequired: 1,
      rides: []
    });

    const result = await driverRepository.findById(driver.id);
    expect(result).toBeDefined();
    expect(result?.id).toBe(driver.id);
  });

  it('should find by minimum distance', async () => {
    await TestDataSource.getRepository(Driver).save({
      id: 2,
      name: 'Test Driver',
      description: 'Test Description',
      vehicle: 'Test Vehicle',
      rating: 5,
      pricePerKm: 2.5,
      minKmRequired: 5,
      rides: []
    });

    const result = await driverRepository.findByMinimumDistance(10);
    expect(result.length).toBeGreaterThan(0);
  });
});
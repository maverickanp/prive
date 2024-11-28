import { DataSource, Repository } from 'typeorm';
import { DriverRepository } from '@/infrastructure/database/repositories/DriverRepository';
import { Driver } from '@/infrastructure/database/entities/Driver';

describe('DriverRepository', () => {
  let repository: DriverRepository;
  let mockRepository: Partial<Repository<Driver>>;
  
  const mockDrivers = [
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
      vehicle: 'Dodge Charger',
      rating: 4,
      pricePerKm: 5.00,
      minKmRequired: 5,
      rides: []
    }
  ] as Driver[];

  beforeEach(() => {
    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockDrivers),
    };

    mockRepository = {
      findOneBy: jest.fn().mockImplementation((conditions: { id: number }) => {
        return Promise.resolve(
          mockDrivers.find(driver => driver.id === conditions.id) || null
        );
      }),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    jest.spyOn(DataSource.prototype, 'getRepository').mockReturnValue(mockRepository as Repository<Driver>);
    
    repository = new DriverRepository();
  });

  describe('findById', () => {
    it('should return a driver when it exists', async () => {
      const driver = await repository.findById(1);
      expect(driver).toEqual(mockDrivers[0]);
    });

    it('should return null when driver does not exist', async () => {
      const driver = await repository.findById(999);
      expect(driver).toBeNull();
    });
  });

  describe('findByMinimumDistance', () => {
    it('should return drivers that accept the minimum distance', async () => {
      const drivers = await repository.findByMinimumDistance(6);
      expect(drivers).toEqual(mockDrivers);
    });

    it('should call query builder with correct parameters', async () => {
      const distance = 10;
      await repository.findByMinimumDistance(distance);
      
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('driver');
    });
  });
});
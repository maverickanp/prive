import { DataSource, Repository } from 'typeorm';
import { RideRepository } from '@/infrastructure/database/repositories/RideRepository';
import { Ride } from '@/infrastructure/database/entities/Ride';
import { Driver } from '@/infrastructure/database/entities/Driver';

describe('RideRepository', () => {
  let repository: RideRepository;
  let mockRepository: Partial<Repository<Ride>>;

  const mockDriver: Driver = {
    id: 1,
    name: 'Homer Simpson',
    description: 'Test description',
    vehicle: 'Plymouth Valiant 1973',
    rating: 2,
    pricePerKm: 2.50,
    minKmRequired: 1,
    rides: []
  };

  const mockRide: Ride = {
    id: 1,
    customerId: 'customer-123',
    origin: 'Origin Street',
    destination: 'Destination Avenue',
    distance: 10.5,
    duration: '30 minutes',
    value: 52.50,
    driver: mockDriver,
    createdAt: new Date(),
    originLatitude: -23.550520,
    originLongitude: -46.633308,
    destinationLatitude: -23.550520,
    destinationLongitude: -46.633308
  };

  beforeEach(() => {
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockRide]),
    };

    mockRepository = {
      create: jest.fn().mockReturnValue(mockRide),
      save: jest.fn().mockResolvedValue(mockRide),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    jest.spyOn(DataSource.prototype, 'getRepository').mockReturnValue(mockRepository as Repository<Ride>);
    
    repository = new RideRepository();
  });

  describe('save', () => {
    it('should create and save a new ride', async () => {
      const newRideData: Partial<Ride> = {
        customerId: 'customer-123',
        origin: 'Origin Street',
        destination: 'Destination Avenue',
        distance: 10.5,
        duration: '30 minutes',
        value: 52.50,
        driver: mockDriver
      };

      const savedRide = await repository.save(newRideData);
      
      expect(mockRepository.create).toHaveBeenCalledWith(newRideData);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(savedRide).toEqual(mockRide);
    });
  });

  describe('findByCustomerId', () => {
    it('should find rides by customer id', async () => {
      const rides = await repository.findByCustomerId('customer-123');
      expect(rides).toEqual([mockRide]);
    });

    it('should find rides by customer id and driver id', async () => {
      const rides = await repository.findByCustomerId('customer-123', 1);
      expect(rides).toEqual([mockRide]);
      
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('ride');
    });
  });
});
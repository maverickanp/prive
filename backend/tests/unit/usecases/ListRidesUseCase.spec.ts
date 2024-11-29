import { ListRidesUseCase } from '@/application/usecases/ListRidesUseCase';
import { IRideRepository } from '@/domain/interfaces/IRideRepository';
import { ValidationError } from '@/domain/errors/ValidationError';
import { Ride } from '@/infrastructure/database/entities/Ride';
import { Driver } from '@/infrastructure/database/entities/Driver';

describe('ListRidesUseCase', () => {
  let mockRideRepository: jest.Mocked<IRideRepository>;
  let sut: ListRidesUseCase;

  const mockDriver: Driver = {
    id: 1,
    name: 'Homer Simpson',
    description: 'Test description',
    vehicle: 'Test vehicle',
    rating: 2,
    pricePerKm: 2.5,
    minKmRequired: 5,
    rides: []
  };

  const mockRides: Ride[] = [
    {
      id: 1,
      customerId: '123',
      origin: 'Origin 1',
      destination: 'Destination 1',
      distance: 10,
      duration: '15 mins',
      value: 25.00,
      driver: mockDriver,
      createdAt: new Date('2024-01-01'),
      originLatitude: -23.55,
      originLongitude: -46.63,
      destinationLatitude: -23.56,
      destinationLongitude: -46.64
    }
  ];

  beforeEach(() => {
    mockRideRepository = {
      save: jest.fn(),
      findByCustomerId: jest.fn()
    };

    sut = new ListRidesUseCase(mockRideRepository);
  });

  it('should throw validation error when customer_id is empty', async () => {
    await expect(sut.execute('')).rejects.toThrow(ValidationError);
  });

  it('should throw validation error when driver_id is invalid', async () => {
    await expect(sut.execute('123', -1)).rejects.toThrow(ValidationError);
  });

  it('should return empty list when no rides are found', async () => {
    mockRideRepository.findByCustomerId.mockResolvedValue([]);

    const result = await sut.execute('123');

    expect(result.customer_id).toBe('123');
    expect(result.rides).toHaveLength(0);
  });

  it('should return list of rides for customer without driver filter', async () => {
    mockRideRepository.findByCustomerId.mockResolvedValue(mockRides);

    const result = await sut.execute('123');

    expect(result.customer_id).toBe('123');
    expect(result.rides).toHaveLength(1);
    expect(mockRideRepository.findByCustomerId).toHaveBeenCalledWith('123', undefined);
    
    const ride = result.rides[0];
    expect(ride).toEqual({
      id: mockRides[0].id,
      date: mockRides[0].createdAt,
      origin: mockRides[0].origin,
      destination: mockRides[0].destination,
      distance: mockRides[0].distance,
      duration: mockRides[0].duration,
      driver: {
        id: mockDriver.id,
        name: mockDriver.name
      },
      value: mockRides[0].value
    });
  });

  it('should return filtered list when driver_id is provided', async () => {
    mockRideRepository.findByCustomerId.mockResolvedValue(mockRides);

    const result = await sut.execute('123', 1);

    expect(result.customer_id).toBe('123');
    expect(result.rides).toHaveLength(1);
    expect(mockRideRepository.findByCustomerId).toHaveBeenCalledWith('123', 1);
  });

  it('should return empty list when no rides match the driver filter', async () => {
    mockRideRepository.findByCustomerId.mockResolvedValue([]);

    const result = await sut.execute('123', 999);

    expect(result.customer_id).toBe('123');
    expect(result.rides).toHaveLength(0);
    expect(mockRideRepository.findByCustomerId).toHaveBeenCalledWith('123', 999);
  });
});
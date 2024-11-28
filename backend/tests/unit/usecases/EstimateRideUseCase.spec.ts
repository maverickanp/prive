import { EstimateRideUseCase } from '@/application/usecases/EstimateRideUseCase';
import { ValidationError } from '@/domain/errors/ValidationError';
import { Driver } from '@/infrastructure/database/entities/Driver';
import { IDriverRepository } from '@/domain/interfaces/IDriverRepository';
import { ILocationService, RouteResponse } from '@/domain/interfaces/ILocationService';

describe('EstimateRideUseCase', () => {
  let mockDriverRepository: jest.Mocked<IDriverRepository>;
  let mockLocationService: jest.Mocked<ILocationService>;
  let sut: EstimateRideUseCase;

  beforeEach(() => {
    mockDriverRepository = {
      findById: jest.fn(),
      findByMinimumDistance: jest.fn()
    };

    mockLocationService = {
      calculateRoute: jest.fn()
    };

    sut = new EstimateRideUseCase(
      mockDriverRepository,
      mockLocationService
    );
  });

  it('should throw validation error when customer_id is empty', async () => {
    await expect(sut.execute({
      customer_id: '',
      origin: 'origin',
      destination: 'destination'
    })).rejects.toThrow(ValidationError);
  });

  it('should throw validation error when origin and destination are the same', async () => {
    await expect(sut.execute({
      customer_id: '123',
      origin: 'same',
      destination: 'same'
    })).rejects.toThrow(ValidationError);
  });

  it('should return correct estimate with available drivers', async () => {
    const mockRoute: RouteResponse = {
      distance: 5000,
      duration: '15 mins',
      origin: { latitude: -23.55, longitude: -46.63 },
      destination: { latitude: -23.56, longitude: -46.64 },
      raw: {}
    };

    const mockDrivers: Driver[] = [
      {
        id: 1,
        name: 'Homer Simpson',
        description: 'Test description',
        vehicle: 'Test vehicle',
        rating: 2,
        pricePerKm: 2.5,
        minKmRequired: 1,
        rides: []
      }
    ];

    mockLocationService.calculateRoute.mockResolvedValue(mockRoute);
    mockDriverRepository.findByMinimumDistance.mockResolvedValue(mockDrivers);

    const result = await sut.execute({
      customer_id: '123',
      origin: 'Test origin',
      destination: 'Test destination'
    });

    expect(result.distance).toBe(5);
    expect(result.duration).toBe('15 mins');
    expect(result.options).toHaveLength(1);
    expect(result.options[0].value).toBe(12.5);
    expect(mockDriverRepository.findByMinimumDistance).toHaveBeenCalledWith(5);
  });
});
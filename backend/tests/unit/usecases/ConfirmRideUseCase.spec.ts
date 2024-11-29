import { ConfirmRideUseCase } from '@/application/usecases/ConfirmRideUseCase';
import { IDriverRepository } from '@/domain/interfaces/IDriverRepository';
import { IRideRepository } from '@/domain/interfaces/IRideRepository';
import { ValidationError } from '@/domain/errors/ValidationError';
import { DriverNotFoundError } from '@/domain/errors/DriverNotFoundError';
import { InvalidDistanceError } from '@/domain/errors/InvalidDistanceError';
import { Driver } from '@/infrastructure/database/entities/Driver';

describe('ConfirmRideUseCase', () => {
  let mockDriverRepository: jest.Mocked<IDriverRepository>;
  let mockRideRepository: jest.Mocked<IRideRepository>;
  let sut: ConfirmRideUseCase;

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

  beforeEach(() => {
    mockDriverRepository = {
      findById: jest.fn(),
      findByMinimumDistance: jest.fn()
    };

    mockRideRepository = {
      save: jest.fn(),
      findByCustomerId: jest.fn()
    };

    sut = new ConfirmRideUseCase(
      mockDriverRepository,
      mockRideRepository
    );
  });

  it('should throw validation error when customer_id is empty', async () => {
    await expect(sut.execute({
      customer_id: '',
      origin: 'origin',
      destination: 'destination',
      distance: 10,
      duration: '15 mins',
      driver: {
        id: 1,
        name: 'Homer'
      },
      value: 25.00
    })).rejects.toThrow(ValidationError);
  });

  it('should throw validation error when origin and destination are the same', async () => {
    await expect(sut.execute({
      customer_id: '123',
      origin: 'same place',
      destination: 'same place',
      distance: 10,
      duration: '15 mins',
      driver: {
        id: 1,
        name: 'Homer'
      },
      value: 25.00
    })).rejects.toThrow(ValidationError);
  });

  it('should throw DriverNotFoundError when driver does not exist', async () => {
    mockDriverRepository.findById.mockResolvedValue(null);

    await expect(sut.execute({
      customer_id: '123',
      origin: 'origin',
      destination: 'destination',
      distance: 10,
      duration: '15 mins',
      driver: {
        id: 999,
        name: 'Not Found'
      },
      value: 25.00
    })).rejects.toThrow(DriverNotFoundError);
  });

  it('should throw InvalidDistanceError when distance is less than driver minimum', async () => {
    mockDriverRepository.findById.mockResolvedValue(mockDriver);

    await expect(sut.execute({
      customer_id: '123',
      origin: 'origin',
      destination: 'destination',
      distance: 3,
      duration: '15 mins',
      driver: {
        id: 1,
        name: 'Homer'
      },
      value: 25.00
    })).rejects.toThrow(InvalidDistanceError);
  });

  it('should save ride when all validations pass', async () => {
    mockDriverRepository.findById.mockResolvedValue(mockDriver);
    mockRideRepository.save.mockResolvedValue({ id: 1 } as any);

    const request = {
      customer_id: '123',
      origin: 'origin',
      destination: 'destination',
      distance: 10,
      duration: '15 mins',
      driver: {
        id: 1,
        name: 'Homer'
      },
      value: 25.00
    };

    const result = await sut.execute(request);

    expect(result.success).toBe(true);
    expect(mockRideRepository.save).toHaveBeenCalledWith({
      customerId: request.customer_id,
      origin: request.origin,
      destination: request.destination,
      distance: request.distance,
      duration: request.duration,
      driver: mockDriver,
      value: request.value,
      originLatitude: null,
      originLongitude: null,
      destinationLatitude: null,
      destinationLongitude: null
    });
  });
});
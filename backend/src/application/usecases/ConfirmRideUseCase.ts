import { inject, injectable } from 'inversify';
import { IDriverRepository } from '@/domain/interfaces/IDriverRepository';
import { IRideRepository } from '@/domain/interfaces/IRideRepository';
import { ValidationError } from '@/domain/errors/ValidationError';
import { DriverNotFoundError } from '@/domain/errors/DriverNotFoundError';
import { InvalidDistanceError } from '@/domain/errors/InvalidDistanceError';
import { TYPES } from '@/infrastructure/container/types';

interface ConfirmRideRequest {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}

@injectable()
export class ConfirmRideUseCase {
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    
    @inject(TYPES.RideRepository)
    private rideRepository: IRideRepository
  ) {}

  async execute(request: ConfirmRideRequest) {
    const { customer_id, origin, destination, distance, duration, driver, value } = request;

    if (!customer_id?.trim()) {
      throw new ValidationError('Customer ID is required');
    }

    if (!origin?.trim() || !destination?.trim()) {
      throw new ValidationError('Origin and destination are required');
    }

    if (origin === destination) {
      throw new ValidationError('Origin and destination must be different');
    }

    const driverEntity = await this.driverRepository.findById(driver.id);
    if (!driverEntity) {
      throw new DriverNotFoundError();
    }

    if (distance < driverEntity.minKmRequired) {
      throw new InvalidDistanceError();
    }

    await this.rideRepository.save({
      customerId: customer_id,
      origin,
      destination,
      distance,
      duration,
      driver: driverEntity,
      value,
      originLatitude: null,
      originLongitude: null,
      destinationLatitude: null,
      destinationLongitude: null
    });

    return { success: true };
  }
}
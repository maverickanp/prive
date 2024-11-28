import { inject, injectable } from 'inversify';
import { IRideRepository } from '@/domain/interfaces/IRideRepository';
import { ValidationError } from '@/domain/errors/ValidationError';
import { TYPES } from '@/infrastructure/container/types';

@injectable()
export class ListRidesUseCase {
  constructor(
    @inject(TYPES.RideRepository)
    private rideRepository: IRideRepository
  ) {}

  async execute(customerId: string, driverId?: number) {
    if (!customerId?.trim()) {
      throw new ValidationError('Customer ID is required');
    }

    if (driverId !== undefined && (!Number.isInteger(driverId) || driverId <= 0)) {
      throw new ValidationError('Invalid driver ID');
    }

    const rides = await this.rideRepository.findByCustomerId(customerId, driverId);

    return {
      customer_id: customerId,
      rides: rides.map(ride => ({
        id: ride.id,
        date: ride.createdAt,
        origin: ride.origin,
        destination: ride.destination,
        distance: ride.distance,
        duration: ride.duration,
        driver: {
          id: ride.driver.id,
          name: ride.driver.name
        },
        value: ride.value
      }))
    };
  }
}
import { IDriverRepository } from '@/domain/interfaces/IDriverRepository';
import { IRideRepository } from '@/domain/interfaces/IRideRepository';

interface ConfirmRideRequest {
  customerId: string;
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

export class ConfirmRideUseCase {
  constructor(
    private rideRepository: IRideRepository,
    private driverRepository: IDriverRepository
  ) {}

  async execute(request: ConfirmRideRequest): Promise<{ success: boolean }> {
    if (!request.customerId?.trim()) {
      throw new Error('Customer ID is required');
    }
    if (!request.origin?.trim() || !request.destination?.trim()) {
      throw new Error('Origin and destination are required');
    }
    if (request.origin === request.destination) {
      throw new Error('Origin and destination must be different');
    }
    if (!request.driver?.id) {
      throw new Error('Driver is required');
    }

    const driver = await this.driverRepository.findById(request.driver.id);
    if (!driver) {
      throw new Error('Driver not found');
    }

    if (request.distance < driver.minKmRequired) {
      throw new Error('Invalid distance for this driver');
    }

    await this.rideRepository.save({
      customerId: request.customerId,
      origin: request.origin,
      destination: request.destination,
      distance: request.distance,
      duration: request.duration,
      driver,
      value: request.value
    });

    return { success: true };
  }
}
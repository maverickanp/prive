import { IDriverRepository } from '@/domain/interfaces/IDriverRepository';
import { IRideRepository } from '@/domain/interfaces/IRideRepository';

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

interface ConfirmRideResponse {
  success: boolean;
}

export class ConfirmRideUseCase {
  constructor(
    private driverRepository: IDriverRepository,
    private rideRepository: IRideRepository
  ) {}

  async execute(request: ConfirmRideRequest): Promise<ConfirmRideResponse> {
    const { customer_id, origin, destination, distance, duration, driver, value } = request;

    if (!customer_id?.trim()) {
      throw new Error('Customer ID is required');
    }

    if (!origin?.trim() || !destination?.trim()) {
      throw new Error('Origin and destination are required');
    }

    if (origin === destination) {
      throw new Error('Origin and destination must be different');
    }

    const driverEntity = await this.driverRepository.findById(driver.id);
    if (!driverEntity) {
      throw new Error('Driver not found');
    }

    if (distance < driverEntity.minKmRequired) {
      throw new Error('Invalid distance for this driver');
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
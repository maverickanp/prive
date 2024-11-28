import { IRideRepository } from '@/domain/interfaces/IRideRepository';
import { Ride } from '@/infrastructure/database/entities/Ride';

export class ListRidesUseCase {
  constructor(private rideRepository: IRideRepository) {}

  async execute(customerId: string, driverId?: number): Promise<Ride[]> {
    if (!customerId?.trim()) {
      throw new Error('Customer ID is required');
    }

    return this.rideRepository.findByCustomerId(customerId, driverId);
  }
}
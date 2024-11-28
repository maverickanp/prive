import { Ride } from '@/infrastructure/database/entities/Ride';

export interface IRideRepository {
  save(ride: Partial<Ride>): Promise<Ride>;
  findByCustomerId(customerId: string, driverId?: number): Promise<Ride[]>;
}
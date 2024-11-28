import { Repository } from 'typeorm';
import { AppDataSource } from '@/infrastructure/config/database';
import { Ride } from '@/infrastructure/database/entities/Ride';
import { IRideRepository } from '@/domain/interfaces/IRideRepository';

export class RideRepository implements IRideRepository {
  private repository: Repository<Ride>;

  constructor() {
    this.repository = AppDataSource.getRepository(Ride);
  }

  async save(ride: Partial<Ride>): Promise<Ride> {
    const newRide = this.repository.create(ride);
    return this.repository.save(newRide);
  }

  async findByCustomerId(customerId: string, driverId?: number): Promise<Ride[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('ride')
      .leftJoinAndSelect('ride.driver', 'driver')
      .where('ride.customer_id = :customerId', { customerId })
      .orderBy('ride.created_at', 'DESC');

    if (driverId) {
      queryBuilder.andWhere('driver.id = :driverId', { driverId });
    }

    return queryBuilder.getMany();
  }
}
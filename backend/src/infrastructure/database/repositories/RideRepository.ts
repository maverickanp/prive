import { Ride } from '@/infrastructure/database/entities/Ride';
import { TestDataSource } from '@/infrastructure/config/database.test';
import { Repository } from 'typeorm';

export class RideRepository {
  private repository: Repository<Ride>;

  constructor() {
    this.repository = TestDataSource.getRepository(Ride);
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
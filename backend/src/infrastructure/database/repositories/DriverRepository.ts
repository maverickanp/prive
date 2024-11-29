import { Driver } from '@/infrastructure/database/entities/Driver';
import { TestDataSource } from '@/infrastructure/config/database.test';
import { Repository } from 'typeorm';

export class DriverRepository {
  private repository: Repository<Driver>;

  constructor() {
    this.repository = TestDataSource.getRepository(Driver);
  }

  async findById(id: number): Promise<Driver | null> {
    return this.repository.findOneBy({ id });
  }

  async findByMinimumDistance(distance: number): Promise<Driver[]> {
    return this.repository
      .createQueryBuilder('driver')
      .where('driver.min_km_required <= :distance', { distance })
      .orderBy('driver.price_per_km', 'ASC')
      .getMany();
  }
}


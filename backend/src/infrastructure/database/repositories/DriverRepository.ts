import { Repository } from 'typeorm';
import { AppDataSource } from '@/infrastructure/config/database';
import { Driver } from '@/infrastructure/database/entities/Driver';
import { IDriverRepository } from '@/domain/interfaces/IDriverRepository';

export class DriverRepository implements IDriverRepository {
  private repository: Repository<Driver>;

  constructor() {
    this.repository = AppDataSource.getRepository(Driver);
  }

  async findById(id: number): Promise<Driver | null> {
    return this.repository.findOneBy({ id });
  }

  async findByMinimumDistance(distance: number): Promise<Driver[]> {
    const distanceNumber = Math.floor(Number(distance));
    
    return this.repository
      .createQueryBuilder('driver')
      .where('driver.min_km_required <= :distance', { 
        distance: distanceNumber 
      })
      .orderBy('driver.price_per_km', 'ASC')
      .getMany();
  }
}


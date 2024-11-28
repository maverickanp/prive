import { Driver } from '@/infrastructure/database/entities/Driver';

export interface IDriverRepository {
  findById(id: number): Promise<Driver | null>;
  findByMinimumDistance(distance: number): Promise<Driver[]>;
}
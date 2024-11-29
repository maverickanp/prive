import { Driver } from '@/infrastructure/database/entities/Driver';

export const createTestDriver = (id: number): Partial<Driver> => ({
  id,
  name: `Test Driver ${id}`,
  description: 'Test description',
  vehicle: 'Test vehicle',
  rating: 2,
  pricePerKm: 2.50,
  minKmRequired: 1,
  rides: []
});
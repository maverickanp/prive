import { TestDataSource } from '@/infrastructure/config/test-database';
import { Driver } from '@/infrastructure/database/entities/Driver';

export const setupTestDatabase = async () => {
  await TestDataSource.initialize();
  
  await TestDataSource.getRepository(Driver).save([
    {
      id: 1,
      name: 'Homer Simpson',
      description: 'Test description',
      vehicle: 'Plymouth Valiant 1973',
      rating: 2,
      pricePerKm: 2.50,
      minKmRequired: 1,
      rides: []
    },
    {
      id: 2,
      name: 'Dominic Toretto',
      description: 'Test description',
      vehicle: 'Dodge Charger',
      rating: 4,
      pricePerKm: 5.00,
      minKmRequired: 5,
      rides: []
    }
  ]);
};

export const clearTestDatabase = async () => {
  const entities = TestDataSource.entityMetadatas;
  
  for (const entity of entities) {
    const repository = TestDataSource.getRepository(entity.name);
    await repository.clear();
  }
};

export const closeTestDatabase = async () => {
  await TestDataSource.destroy();
};
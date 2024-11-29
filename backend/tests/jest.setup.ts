import 'reflect-metadata';
import { TestDataSource } from '@/infrastructure/config/database.test';

beforeAll(async () => {
  await TestDataSource.initialize();
});

beforeEach(async () => {
  await TestDataSource.query('TRUNCATE TABLE rides CASCADE');
  await TestDataSource.query('TRUNCATE TABLE drivers CASCADE');
});

afterAll(async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
});
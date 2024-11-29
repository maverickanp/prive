import { DataSource } from 'typeorm';
import { Driver } from '@/infrastructure/database/entities/Driver';
import { Ride } from '@/infrastructure/database/entities/Ride';

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: process.env.TEST_DB_HOST || 'localhost',
  port: Number(process.env.TEST_DB_PORT) || 5432,
  username: process.env.TEST_DB_USER || 'postgres',
  password: process.env.TEST_DB_PASSWORD || 'postgres',
  database: process.env.TEST_DB_NAME || 'ride_app_test',
  entities: [Driver, Ride],
  synchronize: true,
  logging: false
});
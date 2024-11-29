import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Driver } from '@/infrastructure/database/entities/Driver';
import { Ride } from '@/infrastructure/database/entities/Ride';

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'ride_app_test',
  entities: [Driver, Ride],
  synchronize: true,
  logging: false
});
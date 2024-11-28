import { DataSource } from 'typeorm';
import { Driver } from '../database/entities/Driver';
import { Ride } from '../database/entities/Ride';
import { CreateTables1700000000000 } from '../database/migrations/1700000000000-CreateTables';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'ride_app',
  synchronize: false,
  logging: true,
  entities: [Driver, Ride],
  migrations: [CreateTables1700000000000],
});
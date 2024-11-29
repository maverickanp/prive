import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from '@/infrastructure/config/database';
import { TestDataSource } from '@/infrastructure/config/database.test';
import { rideRoutes } from '@/presentation/routes/ride.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', rideRoutes);

export const dataSource = process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;

export default app;
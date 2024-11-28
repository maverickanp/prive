import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { rideRoutes } from '../presentation/routes/ride.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', rideRoutes);

export default app;
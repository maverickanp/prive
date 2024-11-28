import express from 'express';
import cors from 'cors';
import { rideRoutes } from '@/presentation/routes/ride.routes';
import { testRoutes } from '@/presentation/routes/test.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', rideRoutes);
app.use('/api/test', testRoutes);

export default app;
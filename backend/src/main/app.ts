import express from 'express';
import cors from 'cors';
import { testRoutes } from '@/presentation/routes/test.routes';
import { rideRoutes } from '@/presentation/routes/ride.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/test', testRoutes);
app.use('/api/ride', rideRoutes);

export default app;
import { Router } from 'express';
import { RideController } from '@/presentation/controllers/RideController';

const rideRoutes = Router();
const rideController = new RideController();

rideRoutes.post('/estimate', rideController.estimate);

export { rideRoutes };
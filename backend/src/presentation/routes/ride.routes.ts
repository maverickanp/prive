import { Router } from 'express';
import { RideController } from '@/presentation/controllers/RideController';

const rideRoutes = Router();
const rideController = new RideController();

rideRoutes.post('/ride/estimate', rideController.estimate);
rideRoutes.patch('/ride/confirm', rideController.confirm);


export { rideRoutes };
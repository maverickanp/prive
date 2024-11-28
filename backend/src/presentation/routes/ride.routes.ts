import { Router } from 'express';
import { container } from '@/infrastructure/container';
import { RideController } from '@/presentation/controllers/RideController';

const rideRoutes = Router();
const rideController = container.resolve(RideController);

rideRoutes.post('/ride/estimate', (req, res) => rideController.estimate(req, res));
rideRoutes.patch('/ride/confirm', (req, res) => rideController.confirm(req, res));
rideRoutes.get('/ride/:customer_id', (req, res) => rideController.listRides(req, res));

export { rideRoutes };
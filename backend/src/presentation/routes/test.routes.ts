import { Router } from 'express';
import { TestController } from '@/presentation/controllers/TestController';

const testRoutes = Router();
const testController = new TestController();

testRoutes.post('/routes/calculate', testController.calculateRoute);

export { testRoutes };
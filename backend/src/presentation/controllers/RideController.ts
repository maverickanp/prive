import { Request, Response } from 'express';
import { EstimateRideUseCase } from '@/application/usecases/EstimateRideUseCase';
import { ConfirmRideUseCase } from '@/application/usecases/ConfirmRideUseCase';
import { GoogleMapsService } from '@/infrastructure/services/GoogleMapsService';
import { DriverRepository } from '@/infrastructure/database/repositories/DriverRepository';
import { RideRepository } from '@/infrastructure/database/repositories/RideRepository';

export class RideController {
  async estimate(req: Request, res: Response): Promise<Response> {
    try {
      const { customer_id, origin, destination } = req.body;

      const estimateRideUseCase = new EstimateRideUseCase(
        new DriverRepository(),
        new GoogleMapsService()
      );

      const result = await estimateRideUseCase.execute({
        customer_id,
        origin,
        destination
      });

      return res.status(200).json(result);

    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: error.message
        });
      }

      return res.status(500).json({
        error_code: 'INTERNAL_ERROR',
        error_description: 'Internal server error'
      });
    }
  }

  async confirm(req: Request, res: Response): Promise<Response> {
    try {
      const { 
        customer_id, 
        origin, 
        destination, 
        distance, 
        duration, 
        driver, 
        value 
      } = req.body;

      const confirmRideUseCase = new ConfirmRideUseCase(
        new DriverRepository(),
        new RideRepository()
      );

      const result = await confirmRideUseCase.execute({
        customer_id,
        origin,
        destination,
        distance,
        duration,
        driver,
        value
      });

      return res.status(200).json(result);

    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Driver not found')) {
          return res.status(404).json({
            error_code: 'DRIVER_NOT_FOUND',
            error_description: error.message
          });
        }
        if (error.message.includes('Invalid distance')) {
          return res.status(406).json({
            error_code: 'INVALID_DISTANCE',
            error_description: error.message
          });
        }
        return res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: error.message
        });
      }

      return res.status(500).json({
        error_code: 'INTERNAL_ERROR',
        error_description: 'Internal server error'
      });
    }
  }

  async some(req: Request, res: Response): Promise<void> {
    try {
      const users = {
        "mensagem": "OK"
      }
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
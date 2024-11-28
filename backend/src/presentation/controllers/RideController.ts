import { Request, Response } from 'express';
import { EstimateRideUseCase } from '@/application/usecases/EstimateRideUseCase';
import { GoogleMapsService } from '@/infrastructure/services/GoogleMapsService';
import { DriverRepository } from '@/infrastructure/database/repositories/DriverRepository';

export class RideController {
  async estimate(req: Request, res: Response): Promise<Response> {
    try {
      const { customer_id, origin, destination } = req.body;

      if (!customer_id?.trim()) {
        return res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: 'Customer ID is required'
        });
      }

      if (!origin?.trim()) {
        return res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: 'Origin is required'
        });
      }

      if (!destination?.trim()) {
        return res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: 'Destination is required'
        });
      }

      if (origin === destination) {
        return res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: 'Origin and destination must be different'
        });
      }

      const locationService = new GoogleMapsService();
      const driverRepository = new DriverRepository();

      const estimateRideUseCase = new EstimateRideUseCase(
        driverRepository,
        locationService
      );

      const result = await estimateRideUseCase.execute({
        customerId: customer_id,
        origin,
        destination
      });

      return res.json(result);

    } catch (error) {
      console.error('Error estimating ride:', error);
      
      return res.status(500).json({
        error_code: 'INTERNAL_ERROR',
        error_description: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }
}

import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/infrastructure/container/types';
import { AppError } from '@/domain/errors/AppError';
import { EstimateRideUseCase } from '@/application/usecases/EstimateRideUseCase';
import { ConfirmRideUseCase } from '@/application/usecases/ConfirmRideUseCase';
import { ListRidesUseCase } from '@/application/usecases/ListRidesUseCase';

@injectable()
export class RideController {
  constructor(
    @inject(TYPES.EstimateRideUseCase)
    private estimateRideUseCase: EstimateRideUseCase,

    @inject(TYPES.ConfirmRideUseCase)
    private confirmRideUseCase: ConfirmRideUseCase,

    @inject(TYPES.ListRidesUseCase)
    private listRidesUseCase: ListRidesUseCase
  ) {}

  async estimate(req: Request, res: Response): Promise<Response> {
    try {
      const { customer_id, origin, destination } = req.body;
      
      const result = await this.estimateRideUseCase.execute({
        customer_id,
        origin,
        destination
      });

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error_code: error.errorCode,
          error_description: error.message
        });
      }

      console.error('Unexpected error:', error);
      return res.status(500).json({
        error_code: 'INTERNAL_ERROR',
        error_description: 'Internal server error'
      });
    }
  }

  async confirm(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.confirmRideUseCase.execute(req.body);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error_code: error.errorCode,
          error_description: error.message
        });
      }

      console.error('Unexpected error:', error);
      return res.status(500).json({
        error_code: 'INTERNAL_ERROR',
        error_description: 'Internal server error'
      });
    }
  }

  async listRides(req: Request, res: Response): Promise<Response> {
    try {
      const customerId = req.params.customer_id;
      const driverId = req.query.driver_id ? Number(req.query.driver_id) : undefined;

      const result = await this.listRidesUseCase.execute(customerId, driverId);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error_code: error.errorCode,
          error_description: error.message
        });
      }

      console.error('Unexpected error:', error);
      return res.status(500).json({
        error_code: 'INTERNAL_ERROR',
        error_description: 'Internal server error'
      });
    }
  }
}
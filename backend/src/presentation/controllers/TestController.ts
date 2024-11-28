import { Request, Response } from 'express';
import { GoogleMapsService } from '@/infrastructure/services/GoogleMapsService';

export class TestController {
  async calculateRoute(req: Request, res: Response): Promise<Response> {
    try {
      const { origin, destination } = req.body;

      if (!origin || !destination) {
        return res.status(400).json({
          error: 'Origin and destination are required'
        });
      }

      const googleMapsService = new GoogleMapsService();
      const result = await googleMapsService.calculateRoute(origin, destination);

      return res.json(result);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }
}
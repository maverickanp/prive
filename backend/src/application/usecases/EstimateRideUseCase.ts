import { inject, injectable } from 'inversify';
import { IDriverRepository } from '@/domain/interfaces/IDriverRepository';
import { ILocationService } from '@/domain/interfaces/ILocationService';
import { ValidationError } from '@/domain/errors/ValidationError';
import { TYPES } from '@/infrastructure/container/types';
import { Driver } from '@/infrastructure/database/entities/Driver';

interface EstimateRideRequest {
  customer_id: string;
  origin: string;
  destination: string;
}

@injectable()
export class EstimateRideUseCase {
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,

    @inject(TYPES.LocationService)
    private locationService: ILocationService
  ) { }

  async execute(request: EstimateRideRequest) {
    const { customer_id, origin, destination } = request;

    if (!customer_id?.trim()) {
      throw new ValidationError('Customer ID is required');
    }

    if (!origin?.trim()) {
      throw new ValidationError('Origin is required');
    }

    if (!destination?.trim()) {
      throw new ValidationError('Destination is required');
    }

    if (origin === destination) {
      throw new ValidationError('Origin and destination must be different');
    }

    const route = await this.locationService.calculateRoute(origin, destination);
    const availableDrivers = await this.driverRepository.findByMinimumDistance(route.distance / 1000);

    return {
      origin: route.origin,
      destination: route.destination,
      distance: route.distance / 1000,
      duration: route.duration,
      options: availableDrivers.map(driver => ({
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.vehicle,
        review: {
          rating: driver.rating,
          comment: this.getDriverReview(driver)
        },
        value: Number((route.distance / 1000 * driver.pricePerKm).toFixed(2))
      })).sort((a, b) => a.value - b.value),
      routeResponse: route.raw
    };
  }

  private getDriverReview(driver: Driver): string {
    const reviews: { [key: number]: string } = {
      1: 'Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.',
      2: 'Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!',
      3: 'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.'
    };
    return reviews[driver.id] || '';
  }
}
import { Container } from 'inversify';
import 'reflect-metadata';
import { TYPES } from './types';
import { IDriverRepository } from '@/domain/interfaces/IDriverRepository';
import { IRideRepository } from '@/domain/interfaces/IRideRepository';
import { ILocationService } from '@/domain/interfaces/ILocationService';
import { DriverRepository } from '@/infrastructure/database/repositories/DriverRepository';
import { RideRepository } from '@/infrastructure/database/repositories/RideRepository';
import { GoogleMapsService } from '@/infrastructure/services/GoogleMapsService';
import { EstimateRideUseCase } from '@/application/usecases/EstimateRideUseCase';
import { ConfirmRideUseCase } from '@/application/usecases/ConfirmRideUseCase';
import { ListRidesUseCase } from '@/application/usecases/ListRidesUseCase';

const container = new Container();

container.bind<IDriverRepository>(TYPES.DriverRepository).to(DriverRepository);
container.bind<IRideRepository>(TYPES.RideRepository).to(RideRepository);

container.bind<ILocationService>(TYPES.LocationService).to(GoogleMapsService);

container.bind<EstimateRideUseCase>(TYPES.EstimateRideUseCase).to(EstimateRideUseCase);
container.bind<ConfirmRideUseCase>(TYPES.ConfirmRideUseCase).to(ConfirmRideUseCase);
container.bind<ListRidesUseCase>(TYPES.ListRidesUseCase).to(ListRidesUseCase);

export { container };
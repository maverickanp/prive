import { AppError } from './AppError';

export class DriverNotFoundError extends AppError {
  constructor() {
    super('Driver not found', 404, 'DRIVER_NOT_FOUND');
  }
}
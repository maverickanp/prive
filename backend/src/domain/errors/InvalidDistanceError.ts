import { AppError } from './AppError';

export class InvalidDistanceError extends AppError {
  constructor() {
    super('Invalid distance for this driver', 406, 'INVALID_DISTANCE');
  }
}
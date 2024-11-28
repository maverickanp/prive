import { AppError } from './AppError';

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'INVALID_DATA');
  }
}
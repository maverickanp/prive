import './config/module-alias';
import 'reflect-metadata';
import { AppDataSource } from '@/infrastructure/config/database';
import app from './app';

const PORT = process.env.PORT || 8080;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log('Database connection initialized');
    });
  })
  .catch((error: Error) => {
    console.error('Error initializing database:', error);
    process.exit(1);
  });
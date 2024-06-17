import { DataSource } from 'typeorm';
import { getDataSourceOptions } from './typeorm.config';
import { ConfigService } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables
dotenvConfig();

export const AppDataSource = new DataSource(
  getDataSourceOptions(new ConfigService()),
);

(async () => {
  await AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization:', err);
    });
})();

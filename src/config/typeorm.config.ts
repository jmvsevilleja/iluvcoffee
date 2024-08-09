import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'root'),
  password: configService.get<string>('DB_PASSWORD', 'password'),
  database: configService.get<string>('DB_DATABASE', 'test'),
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
  logging:  configService.get<boolean>('DB_LOGGING', false)
});

export const getDataSourceOptions = (
  configService: ConfigService,
): DataSourceOptions => {
  const config = getTypeOrmConfig(configService) as DataSourceOptions;
  return {
    ...config,
    // Add or override any options specific to DataSource if needed
  };
};

import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
// import { CoffeesController } from './coffees/coffees.controller';
// import { CoffeesService } from './coffees/coffees.service';
import * as Joi from '@hapi/joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { CoffeesModule } from './coffees/coffees.module';
import appConfig from './config/app.config';
import { getTypeOrmConfig } from './config/typeorm.config';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      // ignoreEnvFile: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.required(),
        DB_PORT: Joi.number().default(5432),
      }),
      // isGlobal: true,
      envFilePath: ['.env', `.env.${process.env.NODE_ENV || 'local'}`],
      load: [appConfig],
    }),
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    DatabaseModule.register({
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: +process.env.DB_PORT,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => getTypeOrmConfig(config),
    }),
    CoffeesModule,
    CoffeeRatingModule,
    MongooseModule.forRoot('mongodb://localhost:27017/coffees'),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      // useClass: ValidationPipe,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }), // module scope
    },
  ],
})
export class AppModule {}

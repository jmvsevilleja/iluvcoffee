import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { CoffeesController } from './coffees/coffees.controller';
// import { CoffeesService } from './coffees/coffees.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [CoffeesModule,

  TypeOrmModule.forRootAsync({
    useFactory: () => ({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'pass123',
      database: process.env.DB_NAME || 'postgres',
      autoLoadEntities: true,
      synchronize: process.env.TYPEORM_SYNC === 'true',
     })
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

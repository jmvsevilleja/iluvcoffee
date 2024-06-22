import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
@Module({
  controllers: [CoffeesController],
  exports: [CoffeesService],
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  providers: [
    CoffeesService,
    { provide: COFFEE_BRANDS, useValue: ['kopiko', 'nescafe'] }, // non class provider tokens
  ],
})
export class CoffeesModule {}

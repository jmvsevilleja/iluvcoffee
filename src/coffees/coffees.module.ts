import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
@Module({
  controllers: [CoffeesController],
  exports: [CoffeesService],
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  providers: [CoffeesService],
})
export class CoffeesModule {}

import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
@Module({
  controllers: [CoffeesController],
  //exports: []
  imports: [TypeOrmModule.forFeature([Coffee, Flavor])],
  providers: [CoffeesService],
})
export class CoffeesModule {}

import { Injectable, Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS, COFFEE_SHOPS } from './coffees.constants';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

class ConfigService {}
class DevelopmentConfigService {
  constructor() {
    console.log('DevelopmentConfigService');
  }
}
class ProductionConfigService {
  constructor() {
    console.log('ProductionConfigService');
  }
}

@Injectable()
export class CoffeeBrandsFactory {
  create() {
    return ['Blend45', 'Nescafe'];
  }
}

@Injectable()
export class CoffeeShopsFactory {
  create() {
    return ['Starbucks', 'Coffee Project'];
  }
}

@Module({
  controllers: [CoffeesController],
  exports: [CoffeesService],
  imports: [
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    ConfigModule.forFeature(coffeesConfig),
  ],
  providers: [
    CoffeesService,
    CoffeeBrandsFactory,
    CoffeeShopsFactory,
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
    }, //  custom providers
    { provide: COFFEE_BRANDS, useValue: ['Kopiko', 'Nescafe'] }, // non class provider tokens
    {
      provide: COFFEE_BRANDS,
      useFactory: (brandsFactory: CoffeeBrandsFactory) =>
        brandsFactory.create(),
      inject: [CoffeeBrandsFactory],
    }, // factory Providers
    {
      provide: COFFEE_SHOPS,
      useFactory: (ShopsFactory: CoffeeShopsFactory) => ShopsFactory.create(),
      inject: [CoffeeShopsFactory],
    }, // factory Providers
    {
      provide: COFFEE_BRANDS,
      useFactory: async (dataSource: DataSource): Promise<string[]> => {
        const coffeeBrands = await Promise.resolve(['greate Taste', 'Nescafe']);
        console.log(
          'Using Async Factory, Datasource initialized: ',
          dataSource.isInitialized,
        );
        return coffeeBrands;
      },
      inject: [DataSource],
    }, // factory Providers
  ],
})
export class CoffeesModule {
  constructor() {
    console.log('CoffeesModule instantiated');
  }
}

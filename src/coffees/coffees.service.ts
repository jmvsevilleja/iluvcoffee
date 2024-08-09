import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
// import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
// import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
// import { DataSource } from 'typeorm';
// import { Event } from '../events/entities/event.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { COFFEE_BRANDS, COFFEE_SHOPS } from './coffees.constants';
// import { ConfigService, ConfigType } from '@nestjs/config';
// import coffeesConfig from './config/coffees.config';

@Injectable({ scope: Scope.DEFAULT }) // DEFAULT, TRANSIENT, REQUEST scope - instance lifetime of a provider
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
    // @InjectRepository(Coffee)
    // private readonly coffeeRepository: Repository<Coffee>,
    // @InjectRepository(Flavor)
    // private readonly flavorRepository: Repository<Flavor>,
    // @InjectDataSource() private readonly dataSource: DataSource,
    // private readonly configService: ConfigService,
    // @Inject(coffeesConfig.KEY) coffeesConfiguration: ConfigType<typeof coffeesConfig>,
    // @Inject(COFFEE_BRANDS) coffeeBrands: string[],
    // @Inject(COFFEE_SHOPS) coffeeShops: string[],
  ) {
    // console.log('coffeBrands', coffeeBrands);
    // console.log('coffeShops', coffeeShops);
    console.log('CoffeeService instantiated');

    // const databaseHost = this.configService.get('database.host', 'local');
    // console.log('databaseHost', databaseHost);

    // const coffeesConfigGet = this.configService.get('coffees.foo', 'local');
    // console.log('coffeesConfigGet', coffeesConfigGet);
    // console.log('coffeesConfiguration', coffeesConfiguration.foo); // using configType
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return await this.coffeeModel.find().exec();
  }

  async findOne(id: string) {
    // const coffee = await this.coffeeModel.findOne({ _id: id }).exec();
    const coffee = await this.coffeeModel.findById(id).exec();
    // throw an exception error
    // throw `a random error`;

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    // const flavors = await Promise.all(
    //   createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    // );

    const coffee = new this.coffeeModel(createCoffeeDto);
    return coffee.save();
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    // const flavors =
    //   updateCoffeeDto.flavors &&
    //   (await Promise.all(
    //     updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    //   ));

    const coffee = await this.coffeeModel.findByIdAndUpdate(id, updateCoffeeDto, {
      new: true,
    }).exec();

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async remove(id: string) {
    const coffee = await this.coffeeModel.findByIdAndDelete(id).exec();
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  // async recommendCoffee(coffee: Coffee) {
  //   const queryRunner = this.dataSource.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     coffee.recommendations++;

  //     const recommendEvent = new Event();
  //     recommendEvent.name = 'recommend_coffee';
  //     recommendEvent.type = 'coffee';
  //     recommendEvent.payload = { coffeeId: coffee.id };

  //     await queryRunner.manager.save(coffee);
  //     await queryRunner.manager.save(recommendEvent);

  //     await queryRunner.commitTransaction();
  //   } catch (err) {
  //     await queryRunner.rollbackTransaction();
  //     throw err;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // private async preloadFlavorByName(name: string): Promise<Flavor> {
  //   const existingflavor = await this.flavorRepository.findOne({
  //     where: { name },
  //   });
  //   if (existingflavor) {
  //     return existingflavor;
  //   }
  //   return this.flavorRepository.create({ name });
  // }
}

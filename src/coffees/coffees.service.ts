import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
// import { InjectDataSource } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
// import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
// import { DataSource } from 'typeorm';
import { Event } from '../events/entities/event.entity';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
// import { COFFEE_BRANDS, COFFEE_SHOPS } from './coffees.constants';
// import { ConfigService, ConfigType } from '@nestjs/config';
// import coffeesConfig from './config/coffees.config';

@Injectable({ scope: Scope.DEFAULT }) // DEFAULT, TRANSIENT, REQUEST scope - instance lifetime of a provider
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectConnection() private readonly connection: Connection, // Use InjectConnection to inject the Connection object
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
    return await this.coffeeModel.find().skip(offset).limit(limit).exec();
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

    const coffee = await this.coffeeModel
      .findByIdAndUpdate(id, updateCoffeeDto, {
        new: true,
      })
      .exec();

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

  async recommendCoffee(coffee: Coffee) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // Increment the recommendations
      coffee.recommendations++;

      // Create the event document
      const recommendEvent = new this.eventModel({
        name: 'recommend_coffee',
        type: 'coffee',
        payload: { coffeeId: coffee._id },
      });

      // Save the coffee and event within the transaction
      await coffee.save({ session });
      await recommendEvent.save({ session });

      // Commit the transaction
      await session.commitTransaction();
    } catch (err) {
      // Rollback the transaction on error
      await session.abortTransaction();
      throw err;
    } finally {
      // End the session
      session.endSession();
    }
  }
}

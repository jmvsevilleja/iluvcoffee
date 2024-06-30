import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { DataSource } from 'typeorm';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS, COFFEE_SHOPS } from './coffees.constants';

@Injectable({ scope: Scope.REQUEST }) // DEFAULT, TRANSIENT, REQUEST scope - instance lifetime of a provider
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    @InjectDataSource() private readonly dataSource: DataSource,
    @Inject(COFFEE_BRANDS) coffeeBrands: string[],
    @Inject(COFFEE_SHOPS) coffeeShops: string[],
  ) {
    console.log('coffeBrands', coffeeBrands);
    console.log('coffeShops', coffeeShops);
    console.log('CoffeeService instantiated');
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number) {
    const coffee = await this.coffeRepository.findOne({
      where: { id },
      relations: ['flavors'],
    });

    // throw an exception error
    // throw `a random error`;

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    const coffee = this.coffeRepository.create({ ...createCoffeeDto, flavors });
    return this.coffeRepository.save(coffee);
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));

    const coffee = await this.coffeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return this.coffeRepository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.findOne(id);
    return this.coffeRepository.remove(coffee);
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingflavor = await this.flavorRepository.findOne({
      where: { name },
    });
    if (existingflavor) {
      return existingflavor;
    }
    return this.flavorRepository.create({ name });
  }
}

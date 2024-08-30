import { Injectable } from '@nestjs/common';
import { CoffeesService } from 'src/coffees/coffees.service';

@Injectable()
export class CoffeeRatingService {
  constructor(private readonly coffeeService: CoffeesService) {
    console.log('CoffeRatingService initiated');
  }

  async getCoffeeRating(id: string) {
    const coffee = await this.coffeeService.findOne(id);
    return {
      id: coffee.id,
      rating: Math.ceil(Math.random() * 5),
    };
  }

  // async getCoffeeRatings() {
  //   const coffee = await this.coffeeService.findAll();
  //   return coffee.map((item) => ({
  //     id: item.id,
  //     rating: Math.ceil(Math.random() * 5),
  //   }));
  // }

  // async updateCoffeeRating(id: string, rating: number) {
  //   const coffee = await this.coffeeService.findOne(id);
  //   if (!coffee) {  // throw new NotFoundException(`Coffee #${id} not found`);
  //     return;
  //   }
  //   return this.coffeeService.update(id, { ...coffee, rating });
  // }

  // async removeCoffeeRating(id: string) {
  //   const coffee = await this.coffeeService.findOne(id);
  //   if (!coffee) {  // throw new NotFoundException(`Coffee #${id} not found`);
  //     return;
  //   }
  //   return this.coffeeService.remove(id);
  // }

  // async addCoffeeRating(id: string, rating: number) {
  //   const coffee = await this.coffeeService.findOne(id);
  //   if (!coffee) {  // throw new NotFoundException(`Coffee #${id} not found`);
  //     return;
  //   }
  //   return this.coffeeService.update(id, { ...coffee, rating });
  // }
}

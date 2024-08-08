import { Injectable } from '@nestjs/common';

@Injectable()
export class CoffeeRatingService {
  constructor() {
    console.log('CoffeRatingService initiated');
  }
}

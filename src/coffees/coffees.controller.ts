import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  //   @Get('')
  //   findAll(@Res() response): string {
  //     return response.status(200).send('This action returns all coffees!!!');
  //   }

  @Get()
  findAll(@Query() paginationQuery): Coffee[] {
    // const {limit, offset} = paginationQuery;
    return this.coffeesService.findAll();
    // return `This action returns all coffees!!! Limit: ${limit}, offset ${offset}`;
  }

  @Get(':id')
  findOne(@Param('id') id: number): Coffee {
    console.log(typeof id);
    return this.coffeesService.findOne(id);
    // return `This action returns #${id} coffees!!!`;
  }

  // @Post()
  // @HttpCode(HttpStatus.GONE)
  // create(@Body() body){
  //   return this.coffeesService.create(body);
  //   // return body;
  // }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    console.log(createCoffeeDto instanceof CreateCoffeeDto);
    // const {name, age} = body;
    return this.coffeesService.create(createCoffeeDto);
    // return `This action creates ${name}, ${age} coffees!!!`;
    // return body;
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
    //return `This action updates #${id} coffees!!!`;
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.coffeesService.remove(id);
    // return `This action removes #${id} coffees!!!`;
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  // HttpCode,
  // HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
//  Res,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
// import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Controller('coffees')
export class CoffeesController {
  constructor(
    private readonly coffeesService: CoffeesService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    console.log('CoffeesController created');
    console.log('request host', this.request.headers.host);
  }

  //   @Get('')
  //   findAll(@Res() response): string {
  //     return response.status(200).send('This action returns all coffees!!!');
  //   }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    // const {limit, offset} = paginationQuery;
    return this.coffeesService.findAll(paginationQuery);
    // return `This action returns all coffees!!! Limit: ${limit}, offset ${offset}`;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    // validation pipe transform
    console.log('typeof id', typeof id);
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
    // validation pipe transform
    console.log('createCoffeeDto instanceof CreateCoffeeDto', createCoffeeDto instanceof CreateCoffeeDto);
    // validation pipe whitelist
    console.log('createCoffeeDto', createCoffeeDto);
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
  delete(@Param('id') id: number) {
    return this.coffeesService.remove(id);
    // return `This action removes #${id} coffees!!!`;
  }
}

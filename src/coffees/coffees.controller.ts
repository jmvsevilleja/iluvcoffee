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
  findOne(@Param('id') id: string): Coffee {
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
  create(@Body() body) {
    // const {name, age} = body;
    return this.coffeesService.create(body);
    // return `This action creates ${name}, ${age} coffees!!!`;
    // return body;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.coffeesService.update(id, body);
    //return `This action updates #${id} coffees!!!`;
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.coffeesService.remove(id);
    // return `This action removes #${id} coffees!!!`;
  }
}

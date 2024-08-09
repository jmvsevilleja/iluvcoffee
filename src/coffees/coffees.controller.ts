import {
  Body,
  Controller,
  Delete,
  Get,
  // HttpCode,
  // HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  // SetMetadata,
  // UseGuards,
  // UsePipes,
  ValidationPipe,
  //  Res,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
// import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Public } from '../common/decorator/public.decorator';
import { Protocol } from '../common/decorator/protocol-decorator.decorator';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { WrapResponseInterceptor } from '../common/interceptor/wrap-response.interceptor';

// @UsePipes(ValidationPipe) // controller scope
@ApiTags('coffees')
@Controller('coffees')
@UseInterceptors(WrapResponseInterceptor)
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

  // @UsePipes(ValidationPipe) // method scope
  @ApiResponse({ status: 403, description: 'Forbidden' })
  // @ApiForbiddenResponse({description:"Forbidden"})
  @Public()
  @Get()
  findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    console.log('protocol', protocol);
    const { limit, offset } = paginationQuery;
    console.log(limit, offset);
    console.log('typeof limit', typeof limit);
    console.log('typeof offset', typeof offset);
    return this.coffeesService.findAll(paginationQuery);
    // return `This action returns all coffees!!! Limit: ${limit}, offset ${offset}`;
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    // validation pipe transform
    console.log('typeof id', typeof id, id);
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
  @ApiSecurity('Authorization')
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    // validation pipe transform
    console.log(
      'createCoffeeDto instanceof CreateCoffeeDto',
      createCoffeeDto instanceof CreateCoffeeDto,
    );
    // validation pipe whitelist
    console.log('createCoffeeDto', createCoffeeDto);
    // const {name, age} = body;
    return this.coffeesService.create(createCoffeeDto);
    // return `This action creates ${name}, ${age} coffees!!!`;
    // return body;
  }

  @ApiSecurity('Authorization')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto,
  ) {
    return this.coffeesService.update(id, updateCoffeeDto);
    //return `This action updates #${id} coffees!!!`;
  }

  @ApiSecurity('Authorization')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.coffeesService.remove(id);
    // return `This action removes #${id} coffees!!!`;
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCoffeeDto {
  @ApiProperty({
    description: 'The name of the coffee',
    example: 'White Coffee',
  })
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'The brand of a coffee',
    example: 'Starbucks',
  })
  @IsString()
  readonly brand: string;

  @ApiProperty({
    example: ['Chocolate', 'Vanilla'],
  })
  @IsString({ each: true })
  readonly flavors: string[];
}

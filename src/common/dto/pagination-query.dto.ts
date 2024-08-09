// import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  // @Type(() => Number) // enableImplicitConversion
  @ApiPropertyOptional({ description: 'Limit the number of results returned' })
  @IsOptional()
  @IsPositive()
  limit: number;

  // @Type(() => Number) // enableImplicitConversion
  @ApiPropertyOptional({ description: 'Skip the first n results' })
  @IsOptional()
  @IsPositive()
  offset: number;
}

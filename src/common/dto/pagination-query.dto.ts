// import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  // @Type(() => Number) // enableImplicitConversion
  @IsOptional()
  @IsPositive()
  limit: number;

  // @Type(() => Number) // enableImplicitConversion
  @IsOptional()
  @IsPositive()
  offset: number;
}

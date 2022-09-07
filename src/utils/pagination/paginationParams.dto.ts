import { IsNumber, Min, IsOptional } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 8;

  @IsOptional()
  @Transform(({ obj }) => {
    return [true, 'true'].indexOf(obj.allowPagination) > -1;
  })
  allowPagination?: boolean = true;
}

export interface AggregationOpptionsInterface {
  sort?: Object | String;
  page?: Number;
  offset?: Number;
  limit?: Number;
  customLabels?: Object;
  pagination?: boolean;
  allowDiskUse?: boolean;
}
export class AggregationOpptionsDto {
  sort?: Object | String;

  offset?: Number;

  customLabels?: Object;
  allowDiskUse?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 8;

  @IsOptional()
  @Transform(({ obj }) => {
    return [true, 'true'].indexOf(obj.pagination) > -1;
  })
  pagination?: boolean = true;
}

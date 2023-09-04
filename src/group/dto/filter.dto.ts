import { IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { escapeRegExp } from 'lodash';
import { PaginationParams } from 'src/utils/pagination/paginationParams.dto';

export class FilterQueryGroup {
  @IsOptional()
  @Transform(({ obj }) => {
    return new RegExp(escapeRegExp(obj.name), 'i');
  })
  name?: string;

  @IsOptional()
  @IsMongoId()
  university?: string;

  @IsOptional()
  @IsMongoId()
  collage?: string;



  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => {
    return JSON.parse(obj.enable);
  })
  enable?: boolean;
}

export class FilterQueryOptionsGroup extends IntersectionType(
  FilterQueryGroup,
  PaginationParams,
) { }

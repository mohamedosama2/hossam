import { IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { escapeRegExp } from 'lodash';
import { PaginationParams } from 'src/utils/pagination/paginationParams.dto';
import { Semester } from '../models/subject.model';

export class FilterQuerySubject
{
  @IsOptional()
  @Transform(({ obj }) =>
  {
    return new RegExp(escapeRegExp(obj.nameEn), 'i');
  })
  nameEn?: string;

  @IsOptional()
  @Transform(({ obj }) =>
  {
    return new RegExp(escapeRegExp(obj.nameAr), 'i');
  })
  nameAr?: string;

  @IsOptional()
  @IsMongoId()
  university?: string;

  @IsOptional()
  @IsEnum(Semester)
  semester?: Semester;

  @IsOptional()
  @IsEnum({})
  enable?: boolean;
}

export class FilterQueryOptionsSubject extends IntersectionType(
  FilterQuerySubject,
  PaginationParams,
) { }

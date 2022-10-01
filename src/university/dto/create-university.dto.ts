import { ApiHideProperty, ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { escapeRegExp } from 'lodash';
import { PaginationParams } from 'src/utils/pagination/paginationParams.dto';

export class CreateUniversityDto
{


  @IsBoolean()
  @IsOptional()
  @ApiHideProperty()
  enable: boolean;

  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  photo: string;
}

export class FilterQueryUniversity
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
  @IsBoolean()
  @Transform(({ obj }) =>
  {
    return JSON.parse(obj.enable);
  })
  enable?: boolean;
}

export class FilterQueryOptionsUniversity extends IntersectionType(
  FilterQueryUniversity,
  PaginationParams,
) { }


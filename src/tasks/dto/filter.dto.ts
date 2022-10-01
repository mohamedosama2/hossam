import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { escapeRegExp } from 'lodash';
import
{
  AggregationOpptionsDto,
  PaginationParams,
} from 'src/utils/pagination/paginationParams.dto';
import { IntersectionType } from '@nestjs/swagger';
import { State } from 'src/tasks/models/task.model';

export class FilterQueryTasks
{
  @IsOptional()
  @IsMongoId()
  university?: string;

  @IsOptional()
  from?: string;

  @IsOptional()
  to?: string;

  @IsOptional()
  @IsMongoId()
  subject?: string;

  @IsOptional()
  @IsMongoId()
  teamMember?: string;

  @IsOptional()
  @IsMongoId()
  group?: string;


  @IsOptional()
  @IsEnum(State)
  state?: State;

  @IsOptional()
  @IsEnum({})
  isDeletedTask?: boolean;



  @IsOptional()
  // @Transform(({ obj }) =>
  // {
  //   return new RegExp(escapeRegExp(obj.nameEn), 'i');
  // })
  nameEn?: string;

  @IsOptional()
  // @Transform(({ obj }) =>
  // {
  //   return { $regex: `.*${nameAr}.*`, $options: "i" }  //RegExp(escapeRegExp(obj.nameAr), 'i');
  // })
  nameAr?: string;




}

export class FilterQueryOptionsTasks extends IntersectionType(
  FilterQueryTasks,
  PaginationParams,
) { }

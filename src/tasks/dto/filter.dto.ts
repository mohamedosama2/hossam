import { IsBoolean, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { escapeRegExp } from 'lodash';
import {
AggregationOpptionsDto,
PaginationParams,
} from 'src/utils/pagination/paginationParams.dto';
import { IntersectionType } from '@nestjs/swagger';
import { State, TaskType } from 'src/tasks/models/task.model';

export class FilterQueryTasksUpdated {
  @IsOptional()
  // @IsBoolean()
  // @Transform(({ obj }) =>
  // {
  //   return JSON.parse(obj.isDeletedTask);
  // })
  isDeletedTask?: string;

  @IsOptional()
  // @IsBoolean()
  // @Transform(({ obj }) =>
  // {
  //   return JSON.parse(obj.isDeletedTask);
  // })
  isAdminTask?: string;


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
  @IsEnum(TaskType)
  taskType?: TaskType

  @IsOptional()
  @Transform(({ obj }) => {
    return new RegExp(escapeRegExp(obj.nameEn), 'i');
  })
  nameEn?: string;

  @IsOptional()
  @Transform(({ obj }) => {
    return new RegExp(escapeRegExp(obj.nameAr), 'i');
  })
  nameAr?: string;
}

export class FilterQueryOptionsTasks extends IntersectionType(
  FilterQueryTasksUpdated,
  PaginationParams,
) { }

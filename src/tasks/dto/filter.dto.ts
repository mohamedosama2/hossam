import { IsBoolean, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { escapeRegExp } from 'lodash';
import {
  AggregationOpptionsDto,
  PaginationParams,
} from 'src/utils/pagination/paginationParams.dto';
import { IntersectionType } from '@nestjs/swagger';
import { Semester, State, TaskFor, TaskType } from 'src/tasks/models/task.model';

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
  lecture?: string


  @IsOptional()
  @IsMongoId()
  university?: string;

  @IsOptional()
  @IsMongoId()
  reporter?: string;

  @IsOptional()
  @IsMongoId()
  programmer?: string;

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
  @IsMongoId()
  collage?: string;

  @IsOptional()
  @IsEnum(State)
  state?: State;

  @IsOptional()
  @IsEnum(TaskType)
  taskType?: TaskType

  @IsOptional()
  @IsEnum(TaskFor)
  taskFor?: TaskFor


  @IsOptional()
  @IsEnum(Semester)
  semester?: Semester;


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

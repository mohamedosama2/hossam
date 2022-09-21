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
  @IsMongoId()
  subject?: string;

  @IsOptional()
  @IsMongoId()
  teamMember?: string;

  @IsOptional()
  @IsEnum(State)
  state?: State;
}

export class FilterQueryOptionsTasks extends IntersectionType(
  FilterQueryTasks,
  PaginationParams,
) { }

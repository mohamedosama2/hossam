import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { escapeRegExp } from 'lodash';
import { PaginationParams } from 'src/utils/pagination/paginationParams.dto';
import { IntersectionType } from '@nestjs/swagger';
import { UserRole } from '../models/_user.model';

export class FilterQueryUser
{
  @IsOptional()
  // @Transform(({ obj }) =>
  // {
  //   return new RegExp(escapeRegExp(obj.username), 'i');
  // })
  username?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole

  @IsOptional()
  @IsMongoId()
  university?: string;
}



export class FilterQueryOptionsUser extends IntersectionType(
  FilterQueryUser,
  PaginationParams,
) { }

/* export class FilterQueryNotification {
  @IsMongoId()
  receiver: string;
}

export class FilterQueryOptionsNotification extends IntersectionType(
  FilterQueryUser,
  PaginationParams,
) {} */

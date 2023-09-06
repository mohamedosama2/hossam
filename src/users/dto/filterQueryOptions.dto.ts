import { IsBoolean, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { escapeRegExp } from 'lodash';
import { PaginationParams } from 'src/utils/pagination/paginationParams.dto';
import { IntersectionType } from '@nestjs/swagger';
import { UserRole } from '../models/_user.model';
import { JopTitle } from '../models/teamMember.model';

export class FilterQueryUser {
  @IsOptional()
  // @IsBoolean()
  // @Transform(({ obj }) => {
  //   return JSON.parse(obj.enabled);
  // })
  enabled?: string;


  @IsOptional()
  // @Transform(({ obj }) => {
  //   return new RegExp(escapeRegExp(obj.username), 'i');
  // })
  username?: string;

  @IsOptional()
  // @Transform(({ obj }) => {
  //   return new RegExp(escapeRegExp(obj.usernameAr), 'i');
  // })
  usernameAr?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsEnum(JopTitle)
  @IsOptional()
  jobTitle?: JopTitle;


  @IsOptional()
  @IsMongoId()
  university?: string;


  @IsOptional()
  @IsMongoId()
  collage?: string;

  @IsOptional()
  from?: string;

  @IsOptional()
  to?: string;
}
export class FilterQueryOptionsUser extends IntersectionType(
  FilterQueryUser,
  PaginationParams,
) { }


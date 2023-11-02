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
import { PaymentType } from '../models/payment.model';

export class FilterQueryPayment {
  @IsOptional()
  @IsMongoId()
  task?: string;

  @IsOptional()
  @IsMongoId()
  teamMember?: string;


  @IsOptional()
  @IsMongoId()
  byWhom?: string;

  @IsOptional()
  from?: string;

  @IsOptional()
  to?: string;

  @IsOptional()
  title?: string;

  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType;

  @IsOptional()
  // @Transform(({ obj }) => {
  //   return JSON.parse(obj.isDeletedPayment);
  // })
  isDeletedPayment?: string;
}

export class FilterQueryOptionsPayment extends IntersectionType(
  FilterQueryPayment,
  PaginationParams,
) { }

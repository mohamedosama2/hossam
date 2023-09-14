import { ApiHideProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentMethod, PaymentType } from '../models/payment.model';

export class CreatePaymentDto {
  @IsString()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsString()
  @IsEnum(PaymentType)
  @IsOptional()
  paymentType: PaymentType;

  @IsMongoId()
  @IsOptional()
  byWhom: string;


  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  photo?: string;


  @IsString()
  @IsOptional()
  title?: string;



  @IsBoolean()
  @IsOptional()
  @ApiHideProperty()
  isDeletedPayment: boolean;


  @IsOptional()
  @ApiHideProperty()
  @IsMongoId()
  teamMember: string;

  @IsMongoId()
  task: string;

  @IsNumber()
  paid: number;

  @IsDate()
  recieveTime: Date;
}

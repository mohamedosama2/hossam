import { IsDate, IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentMethod, PaymentType } from '../models/payment.model';

export class CreatePaymentDto
{
  @IsString()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsString()
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsMongoId()
  byWhom: string;
  @IsMongoId()
  teamMember: string;

  @IsMongoId()
  task: string;

  @IsNumber()
  paid: number;

  @IsDate()
  recieveTime: Date;
}

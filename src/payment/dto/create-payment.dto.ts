import { IsDate, IsEnum, IsMongoId, IsNumber, IsString } from 'class-validator';
import { PaymentMethod } from '../models/payment.model';

export class CreatePaymentDto {
  @IsString()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsMongoId()
  byWhom: string;

  @IsMongoId()
  task: string;

  @IsNumber()
  paid: number;

  @IsDate()
  recieveTime: Date;
}

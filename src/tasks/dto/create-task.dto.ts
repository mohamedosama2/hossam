import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreatePaymentDto } from 'src/payment/dto/create-payment.dto';
import { PaymentMethod } from 'src/payment/models/payment.model';
import { State } from '../models/task.model';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @IsMongoId()
  university: string;

  @IsMongoId()
  subject: string;

  @IsMongoId()
  group: string;

  @IsMongoId()
  taskManager: string;

  @IsNumber()
  totalPrice: number;

  @IsString()
  @IsEnum(State)
  state: State;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreatePaymentTaskDto)
  payment?: Record<string, any>;
}

export class CreatePaymentTaskDto {
  @IsString()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsMongoId()
  byWhom: string;

  @IsNumber()
  paid: number;

  @IsDate()
  recieveTime: Date;
}


/* 
ex
{
  "nameAr": "تاسك",
  "nameEn": "task",
  "university": "6316a9b028dbf037bbc843a4",
  "subject": "6316c66e991ab4ce200413ed",
  "group": "6316d104346fdc306236a8e0",
  "taskManager": "6316bbf0bf84293049a66420",
  "totalPrice": 100,
  "state": "PENDING",
  "startDate": "2022-09-06T12:44:57.669Z",
  "endDate": "2022-09-06T12:44:57.669Z",
  "payment": {
   "method":"CASH",
    "paid":20,
    "byWhom":"6316ba089a32490e89771bba",
"recieveTime":"2022-09-06T12:44:57.669Z"
}
}
*/
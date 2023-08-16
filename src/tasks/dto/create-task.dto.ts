import { Type } from 'class-transformer'
import { ApiHideProperty } from '@nestjs/swagger';
;
import {
  IsBoolean,
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
import { LevelType, State, WeekDay, TaskType, TasksLevel, ATTENDENCEPALCE, LessonFor } from '../models/task.model';


export class Level {

  @IsString()
  @IsEnum(LevelType)
  levelType: LevelType;


  @IsString()
  @IsEnum(State)
  levelStatus: State;


  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  degree?: number;

  @IsDate()
  @IsOptional()
  deuDate?: Date;
}


export class Day {

  @IsString()
  @IsEnum(WeekDay)
  day: WeekDay;


  @IsDate()
  @IsOptional()
  start?: Date;


  @IsDate()
  @IsOptional()
  end?: Date;
}


export class TaskLevel {

  @IsString()
  @IsEnum(TasksLevel)
  taskLevel: TasksLevel;

  @IsOptional()
  @Type(() => Level)
  taskLevelData?: Level[];
}

export class TaskManagerDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  @ApiHideProperty()
  name?: string;
}
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @IsString()
  @IsNotEmpty()
  nameEn: string;



  @IsString()
  @IsEnum(TaskType)
  taskType: TaskType;


  @IsBoolean()
  @IsOptional()
  @ApiHideProperty()
  isAdminTask: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiHideProperty()
  isDeletedTask: boolean;

  @IsOptional()
  @IsMongoId()
  university: string;

  @IsOptional()
  @IsMongoId()
  collage: string;

  @IsOptional()
  @IsMongoId()
  @IsOptional()
  student?: string;


  @IsOptional()
  @IsMongoId()
  subject: string;

  @IsOptional()
  logo?: string;


  @IsOptional()
  @IsMongoId()
  group: string;

  @IsOptional()
  @Type(() => TaskLevel)
  levels?: TaskLevel[];


  @IsOptional()
  @Type(() => Day)
  days?: Day[];


  @IsOptional()
  @Type(() => TaskManagerDto)
  taskManager?: TaskManagerDto;

  @IsOptional()
  @IsNumber()
  totalPrice: number;

  @IsOptional()
  @IsNumber()
  totalPriceTeamMember: number;

  @IsOptional()
  @IsNumber()
  numberOfHours: number;
  @IsOptional()
  @IsNumber()
  hourPrice: number;


  @IsOptional()
  @IsString()
  @IsEnum(ATTENDENCEPALCE)
  attendancePlace?: ATTENDENCEPALCE;

  @IsOptional()
  @IsString()
  @IsEnum(LessonFor)
  lessonFor?: LessonFor;



  @IsString()
  @IsEnum(State)
  state: State;

  @IsDate()
  startDate: Date;

  @IsDate()
  @IsOptional()
  deuDate?: Date;

  @IsDate()
  endDate: Date;

  @IsOptional()
  @Type(() => CreatePaymentTaskDto)
  payment?: CreatePaymentTaskDto[];
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

export class CreateLevelTaskDto {
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

export class CreateDtoTasks {
  @Type(() => Date)
  @IsDate()
  date: Date;
}

/* 
ex
{
  "nameAr": "تاسك",
  "nameEn": "task",
  "university": "6316a9b028dbf037bbc843a4",
  "subject": "6316c66e991ab4ce200413ed",
  "group": "6316d104346fdc306236a8e0",
  "taskManager": {
    "id": "6316bbf0bf84293049a66420"
  },
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

import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsNonPrimitiveArray } from 'src/utils/custumValidationDecorator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  university: string;

  @IsArray()
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => CreateStudentGroupDto)
  students: CreateStudentGroupDto[];
}

export class CreateStudentGroupDto {
  @IsMongoId()
  student: string;

  @IsBoolean()
  isTeamLeader: boolean;
}

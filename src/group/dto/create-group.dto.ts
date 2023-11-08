import { ApiHideProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
IsArray,
IsBoolean,
IsEnum,
IsMongoId,
IsNotEmpty,
IsOptional,
IsString,
ValidateNested,
} from 'class-validator';
import { Semester } from 'src/subjects/models/subject.model';
import { IsNonPrimitiveArray } from 'src/utils/custumValidationDecorator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  university: string;

  @IsMongoId()
  collage: string;


  @IsArray()
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => CreateStudentGroupDto)
  students: CreateStudentGroupDto[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => {
    return [true, 'true'].indexOf(obj.isApprovedToJoinRequest) > -1;
  })
  enable: boolean;


  @IsEnum(Semester)
  semester: Semester;

}

export class CreateStudentGroupDto {
  @IsMongoId()
  student: string;

  @IsBoolean()
  isTeamLeader: boolean;
}

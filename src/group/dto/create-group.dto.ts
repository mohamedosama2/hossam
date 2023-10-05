import { ApiHideProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import
  {
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

export class CreateGroupDto
{
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

  @IsBoolean()
  @IsOptional()
  @ApiHideProperty()
  enable: boolean;

  
  @IsEnum(Semester)
  semester: Semester;

}

export class CreateStudentGroupDto
{
  @IsMongoId()
  student: string;

  @IsBoolean()
  isTeamLeader: boolean;
}

import { ApiHideProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import
  {
    IsArray,
    IsBoolean,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
  } from 'class-validator';
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


}

export class CreateStudentGroupDto
{
  @IsMongoId()
  student: string;

  @IsBoolean()
  isTeamLeader: boolean;
}

import { ApiHideProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Semester } from '../models/subject.model';

export class CreateSubjectDto
{
  @IsMongoId()
  university: string;

  @IsEnum(Semester)
  semester: Semester;

  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @IsBoolean()
  @IsOptional()
  @ApiHideProperty()
  enable: boolean;

  @IsString()
  @IsNotEmpty()
  doctorNameAr: string;

  @IsString()
  @IsNotEmpty()
  doctorNameEn: string;

  @IsString()
  @IsNotEmpty()
  driveLink: string;

  @IsString()
  @IsNotEmpty()
  driveMaterials: string;
}

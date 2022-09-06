import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Semester } from '../models/subject.model';

export class CreateSubjectDto {
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

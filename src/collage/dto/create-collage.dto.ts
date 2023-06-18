// export class CreateCollageDto {}
import { ApiHideProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
// import { Semester } from '../models/subject.model';

export class CreateCollageDto {
    @IsMongoId()
    university: string;

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

}

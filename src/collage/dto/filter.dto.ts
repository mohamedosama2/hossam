import { IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { escapeRegExp } from 'lodash';
import { PaginationParams } from 'src/utils/pagination/paginationParams.dto';

export class FilterQueryCollage {
    @IsOptional()
    @Transform(({ obj }) => {
        return new RegExp(escapeRegExp(obj.nameEn), 'i');
    })
    nameEn?: string;

    @IsOptional()
    @Transform(({ obj }) => {
        return new RegExp(escapeRegExp(obj.nameAr), 'i');
    })
    nameAr?: string;

    @IsOptional()
    @IsMongoId()
    university?: string;


    @IsOptional()
    @IsBoolean()
    @Transform(({ obj }) => {
        return JSON.parse(obj.enable);
    })
    enable?: boolean;
}

export class FilterQueryOptionsCollage extends IntersectionType(
    FilterQueryCollage,
    PaginationParams,
) { }

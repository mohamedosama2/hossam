import { ApiHideProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class TaskManager 
{

    @IsString()
    @IsOptional()
    @ApiHideProperty()
    id?: string;

    @IsString()
    @IsOptional()
    name?: string;


}
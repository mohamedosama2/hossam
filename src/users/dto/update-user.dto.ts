import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;


  @IsString()
  @IsOptional()
  password?: string;
}

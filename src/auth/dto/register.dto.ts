import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Constants } from '../../utils/constants';
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  usernameAr?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsString()
  @Matches(Constants.PHONE_REGX, { message: 'phone is invalid' })
  phone: string;

  @IsString()
  @Matches(Constants.EMAIL_REGX, { message: 'email is invalid' })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
  photo: string;
}

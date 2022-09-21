import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { Constants } from 'src/utils/constants';

export class CreateStudentDto {
  @IsString()
  @IsMongoId()
  university: string;


  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  usernameAr?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @Matches(Constants.PHONE_REGX, { message: 'phone is invalid' })
  phone: string;

  @IsString()
  @Matches(Constants.EMAIL_REGX, { message: 'email is invalid' })
  email: string;
}

export class CreateTeamMemberDto extends RegisterDto {
  @IsString()
  @Matches(Constants.PHONE_REGX, { message: 'phone is invalid' })
  whatsapp: string;

  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
  photo: string;
}

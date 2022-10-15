import
{
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Constants } from 'src/utils/constants';

export class UpdateUserDto
{
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsString()
  @IsOptional()
  password?: string;

  @IsOptional()
  @IsString()
  @IsMongoId()
  university?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  usernameAr?: string;

  @IsOptional()
  @IsString()
  @Matches(Constants.PHONE_REGX, { message: 'phone is invalid' })
  phone?: string;

  @IsOptional()
  @IsString()
  @Matches(Constants.PHONE_REGX, { message: 'whatsapp is invalid' })
  whatsapp?: string;

  @IsOptional()
  @IsString()
  @Matches(Constants.EMAIL_REGX, { message: 'email is invalid' })
  email?: string;
}

export class UpdateTeamMemberDto
{
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
  photo?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsOptional()
  @IsString()
  @IsMongoId()
  university?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  usernameAr?: string;

  @IsOptional()
  @IsString()
  @Matches(Constants.PHONE_REGX, { message: 'phone is invalid' })
  phone?: string;

  @IsOptional()
  @IsString()
  @Matches(Constants.EMAIL_REGX, { message: 'email is invalid' })
  email?: string;

  @IsString()
  @Matches(Constants.PHONE_REGX, { message: 'phone is invalid' })
  @IsOptional()
  whatsapp?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  jobTitle?: string;
}

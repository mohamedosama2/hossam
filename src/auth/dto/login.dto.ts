import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Constants } from '../../utils/constants';
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @Matches(Constants.EMAIL_REGX, { message: 'email is invalid' })
  email: string;
}

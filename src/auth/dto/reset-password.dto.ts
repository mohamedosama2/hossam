import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Constants } from 'src/utils/constants';
export class ResetPasswordDto {
  @IsString()
  @Matches(Constants.EMAIL_REGX, { message: 'email is invalid' })
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

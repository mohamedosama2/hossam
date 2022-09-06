import { IsMongoId, IsNotEmpty, IsString, Matches } from 'class-validator';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { Constants } from 'src/utils/constants';

export class CreateStudentDto extends RegisterDto {
  @IsString()
  @IsMongoId()
  university: string;
}

export class CreateTeamMemberDto extends RegisterDto {
  @IsString()
  @Matches(Constants.PHONE_REGX, { message: 'phone is invalid' })
  whatsapp: string;

  @IsString()
  @IsNotEmpty()
  jobTitle: string;
}

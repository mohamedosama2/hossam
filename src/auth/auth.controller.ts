import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from './decorators/public.decorator';
import { PhoneConfirmationService } from 'src/phone-confirmation/phone-confirmation.service';
import { LoginGoogleDto } from './dto/login-google.dto';
import { LoginFacebookDto } from './dto/login-facebook.dto';
import { GoogleOauthGuard } from './guards/googleToken.guard';
import { REQUEST } from '@nestjs/core';
import { User, UserDocument, UserRole } from 'src/users/models/_user.model';
import { CheckCodeToResetDto } from './dto/check-code-to-reset.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { StudentDocument } from 'src/users/models/student.model';
import { FilterQuery } from 'mongoose';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRepository } from 'src/users/users.repository';
import { Query } from '@nestjs/common';
import { CreateEmailConfirmationDto } from 'src/phone-confirmation/dto/create-phone-confirmation.dto';
import { UserNotFoundException } from 'src/users/exceptions/userNotFound.exception';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
    @Inject(REQUEST) private readonly req: Record<string, unknown>,
    private mailerService: MailerService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() LoginDto: LoginDto): Promise<{
    user: UserDocument;
    token: string;
  }> {
    return await this.authService.login(LoginDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('forget-pass-email')
  async sendEmail(
    @Query() CreateEmailConfirmationDto: CreateEmailConfirmationDto,
  ) {
    const code = Math.floor(Math.random() * 90000) + 10000;
    console.log(code);
    const admin = await this.userRepository.findOne({
      email: CreateEmailConfirmationDto.email,
      role: UserRole.ADMIN,
    });
    if (!admin) throw new NotFoundException('Not Found');
    await this.userRepository.updateOne(
      {
        email: CreateEmailConfirmationDto.email,
        role: UserRole.ADMIN,
      },
      { code },
    );
    /*  const mail = {
      to: CreateEmailConfirmationDto.email,
      subject: 'Greeting Message from NestJS Sendgrid',
      from: process.env.email,
      text: `YOUR CODE IS ${code}`,
      html: '<h1>Hello World from NestJS Sendgrid</h1>',
    }; */

    /*     return await this.authService.send(mail); */
    const mail = await this.mailerService.sendMail({
      to: CreateEmailConfirmationDto.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Our App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: CreateEmailConfirmationDto.email,
        code,
      },
    });
    console.log(mail);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('verify-pass-email')
  async verifyEmail(@Query() ResetPasswordDto: ResetPasswordDto) {
    const isExistedAdmin = await this.userRepository.findOne({
      role: UserRole.ADMIN,
      email: ResetPasswordDto.email,
      code: { $exists: true },
    });
    if (!isExistedAdmin) throw new NotFoundException('Not Found');
    if (ResetPasswordDto.code !== isExistedAdmin['code'])
      throw new BadRequestException('The code does not match');
    await this.userRepository.updateOneVoid(
      { role: UserRole.ADMIN, email: ResetPasswordDto.email },
      {
        $set: {
          password: await (isExistedAdmin as any).hashing(
            ResetPasswordDto.password,
          ),
        },
        $unset: { code: '' },
      },
    );
  }
}
/*  @Public()
  @Post('/signup')
  async register(@Body() RegisterDto: RegisterDto) {
    let user = await this.authService.register(RegisterDto);
    await this.phoneConfirmationService.sendSMS({
      phone: RegisterDto.phone,
    }); 
    return user;
  }*/

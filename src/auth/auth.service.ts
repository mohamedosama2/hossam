import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as jwt from 'jsonwebtoken';
import TokenPayload from './interfaces/tokenPayload.interface';
import { LoginGoogleDto } from './dto/login-google.dto';
import { User, UserDocument } from 'src/users/models/_user.model';
import { LoginFacebookDto } from './dto/login-facebook.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { UserNotFoundException } from 'src/users/exceptions/userNotFound.exception';
import { JwtService } from '@nestjs/jwt';
import { StudentDocument } from 'src/users/models/student.model';
import { CreateQuery, FilterQuery } from 'mongoose';
import { UserRepository } from 'src/users/users.repository';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    SendGrid.setApiKey(this.configService.get<string>('SEND_GRID_KEY'));
  }

  async login(loginDto: LoginDto): Promise<{
    user: UserDocument;
    token: string;
  }> {
    const { email } = loginDto;
    console.log(email);

    let user = await this.userRepository.findOne({
      email,
    } as FilterQuery<UserDocument>);
    if (!user) throw new UserNotFoundException();
    console.log(user,"1");
    if (!(await (user as any).isValidPassword(loginDto.password)))
      throw new UnauthorizedException('invalid credentials');
    console.log(user);

    if (user.enabled === false)
      throw new UnauthorizedException('your account is deactivated');
    const payload: TokenPayload = {
      userId: user.id,
    };
    const options = {};
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    return { user, token };
  }

  async verifyUserByTokenFromSocket(
    token: string,
  ): Promise<false | UserDocument> {
    try {
      const decoded: TokenPayload = await this.jwtService.verify(token);
      if (decoded.userId === undefined) {
        return false;
      }

      const user = await this.userRepository.findOne({
        _id: decoded.userId,
      } as FilterQuery<UserDocument>);

      if (!user || user.enabled === false) {
        return false;
      }
      return user;
    } catch (err) {
      return false;
    }
  }


  async send(mail: SendGrid.MailDataRequired) {
    const transport = await SendGrid.send(mail);

    console.log(`Email successfully dispatched to ${mail.to}`);
    return transport;
  }
}
/*   async register(registerationData: RegisterDto): Promise<StudentDocument> {
    let user = await this.userRepository.findOne({
      phone: registerationData.phone,
    } as FilterQuery<UserDocument>);
    if (user) throw new BadRequestException('phone should be unique');
    // user = await this.userRepository.create({
    //   ...registerationData,
    //   role: 'student',
    // } as CreateQuery<UserDocument>);
    user = await this.userRepository.createDoc({
      ...registerationData,
      role: 'admin',
    } as User);
    return user;
  }
 */
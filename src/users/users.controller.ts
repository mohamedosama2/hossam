import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Inject,
  UseFilters,
  UploadedFiles,
  ValidationPipe,
  UsePipes,
  HttpStatus,
  HttpCode,
  Query,
  CacheInterceptor,
  CacheKey,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { request } from 'http';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateTeamMemberDto, UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument, UserRole } from './models/_user.model';
import { UsersService } from './users.service';
import { REQUEST } from '@nestjs/core';
import { AuthUser } from 'src/auth/decorators/me.decorator';
import { ChangePasswordDto } from 'src/users/dto/change-password.dto';
import { PaginationParams } from 'src/utils/pagination/paginationParams.dto';
import ParamsWithId from 'src/utils/paramsWithId.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { FilterQuery, PaginateResult } from 'mongoose';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiOkResponseGeneral } from 'src/utils/pagination/apiOkResponseGeneral';
import { Student, StudentDocument } from './models/student.model';
import { FilterQueryOptionsUser } from './dto/filterQueryOptions.dto';
import { UserRepository } from './users.repository';
import { Constants } from 'src/utils/constants';
import { CreateStudentDto, CreateTeamMemberDto } from './dto/create-user.dto';
import { CounterRepository } from 'src/shared/counter.repository';
var ObjectId = require('mongodb').ObjectId;

@ApiBearerAuth()
@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly UserRepository: UserRepository,
    private counterRepository: CounterRepository,

    @Inject(REQUEST) private readonly req: Record<string, unknown>,
  ) { }

  // @Roles(UserRole.STUDENT)
  // @CacheKey(Constants.GET_POSTS_CACHE_KEY)
  @Public()
  @ApiOkResponseGeneral(User)
  @Get()
  async findAll(
    @Query() queryFiltersAndOptions: FilterQueryOptionsUser,
  ): Promise<PaginateResult<UserDocument> | UserDocument[]> {
    return await this.usersService.findAll(
      queryFiltersAndOptions as FilterQueryOptionsUser,
    );
  }

  @Get('profile')
  async getProfile(): Promise<UserDocument> {
    return await this.usersService.getProfile(this.req.me as UserDocument);
  }

  /*   @UseInterceptors(FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }]))
    @ApiConsumes('multipart/form-data') */
  @Roles(UserRole.ADMIN)
  @Patch('update-student/:id')
  async updateProfile(
    @Body() updateUserData: UpdateUserDto,
    @Param() { id }: ParamsWithId,
  ): Promise<UserDocument> {
    delete updateUserData.enabled;

    return await this.usersService.update(
      { _id: ObjectId(id), role: UserRole.STUDENT } as any,
      updateUserData,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('/change-password')
  async changePassword(
    @Body() { oldPassword, newPassword }: ChangePasswordDto,
    @AuthUser() me: UserDocument,
  ): Promise<UserDocument> {
    return await this.usersService.changePassword(
      { oldPassword, newPassword },
      me,
    );
  }

  @Public()
  @Get(':id')
  async fetchUserById(@Param() { id }: ParamsWithId): Promise<UserDocument> {
    return await this.usersService.findOne({
      _id: id,
    } as FilterQuery<UserDocument>);
  }

  @Roles(UserRole.ADMIN)
  @Post('add-student')
  async addStudent(
    @Body() registerationData: CreateStudentDto,
    /*  @UploadedFiles()
    files, */
  ) {
    // let user = await this.UserRepository.findOne({
    //   $or: [
    //     { email: registerationData.email },
    //     { phone: registerationData.phone },
    //   ],
    // });
    let user = await this.UserRepository.findUser(registerationData.phone, registerationData.email, UserRole.STUDENT)
    console.log(user)
    if (user) throw new BadRequestException('phone and email should be unique');
    if (user) {

      if (user.email === registerationData.email)
        throw new BadRequestException(
          'email should be unique',
        );
      else if (user.phone === registerationData.phone)
        throw new BadRequestException(
          'phone should be unique',
        );
      else
        throw new BadRequestException(
          ' whatsapp should be unique',
        );

    }


    /* if (files && files.photo)
      registerationData.photo = files.photo[0].secure_url; */
    const counter = await this.counterRepository.getCounter('User');
    registerationData.userId = counter + 1;
    registerationData.enrolmentDate = registerationData.enrolmentDate == undefined ? Date.now() : registerationData.enrolmentDate as any
    let newUser = await this.UserRepository.createDoc({
      role: UserRole.STUDENT,
      enabled: true,
      ...registerationData,
    } as any);
    return newUser;
  }

  // @Roles(UserRole.ADMIN)
  @Public()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }]))
  @ApiConsumes('multipart/form-data')
  @Post('add-teamMember')
  async addTeamMember(
    @Body() registerationData: CreateTeamMemberDto,
    @UploadedFiles()
    files,
  ) {
    // console.log(registerationData)
    // let user = await this.UserRepository.findOne({
    //   // role: UserRole.teamMember,
    //   $or: [
    //     {
    //       phone: registerationData.phone,
    //     },
    //     {
    //       email: registerationData.email,
    //     }
    //     // role: UserRole.teamMember, 'whatsapp': registerationData.whatsapp
    //   ]
    // });
    let user = await this.UserRepository.findUser(registerationData.phone, registerationData.whatsapp, registerationData.email, UserRole.teamMember)
    console.log(user)
    if (user) {

      if (user.email === registerationData.email)
        throw new BadRequestException(
          'email should be unique',
        );
      else if (user.phone === registerationData.phone)
        throw new BadRequestException(
          'phone should be unique',
        );
      else
        throw new BadRequestException(
          ' whatsapp should be unique',
        );

    }


    if (files && files.photo)
      registerationData.photo = files.photo[0].secure_url;
    const counter = await this.counterRepository.getCounter('User');
    registerationData.userId = counter + 1;
    let newUser = await this.UserRepository.createDoc({
      role: UserRole.teamMember,
      enabled: true,
      ...registerationData,
    } as any);
    return newUser;
  }

  @Roles(UserRole.ADMIN, UserRole.teamMember)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }]))
  @ApiConsumes('multipart/form-data')
  @Patch('update-teamMember/:id/')
  async updateMember(
    @Body() updateUserData: UpdateTeamMemberDto,
    @UploadedFiles()
    files,
    @Param() { id }: ParamsWithId,
  ): Promise<UserDocument> {
    if (files && files.photo) {
      console.log('files');
      updateUserData.photo = files.photo[0].secure_url;
      console.log(updateUserData.photo);
    }

    return await this.UserRepository.updateUser(
      { _id: id, role: UserRole.teamMember } as any,
      updateUserData as any,
    );
  }
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param() { id }: ParamsWithId) {
    return await this.usersService.deleteStudent(id);
  }
}

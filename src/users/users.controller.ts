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
import { UpdateUserDto } from './dto/update-user.dto';
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

@ApiBearerAuth()
@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly UserRepository: UserRepository,
    @Inject(REQUEST) private readonly req: Record<string, unknown>,
  ) {}

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

  @Patch('profile')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }]))
  @ApiConsumes('multipart/form-data')
  async updateProfile(
    @Body() updateUserData: UpdateUserDto,
  ): Promise<UserDocument> {
    delete updateUserData.enabled;

    return await this.usersService.update(
      { _id: this.req.me } as FilterQuery<UserDocument>,
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
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }]))
  @ApiConsumes('multipart/form-data')
  @Post('add-student')
  async addStudent(
    @Body() registerationData: CreateStudentDto,
    /*  @UploadedFiles()
    files, */
  ) {
    let user = await this.UserRepository.findOne({
      $or: [
        { phone: registerationData.phone },
        { email: registerationData.email },
      ],
    });
    if (user) throw new BadRequestException('phone and email should be unique');
    /* if (files && files.photo)
      registerationData.photo = files.photo[0].secure_url; */

    let newUser = await this.UserRepository.createDoc({
      role: UserRole.STUDENT,
      enabled: true,
      ...registerationData,
    });
    return newUser;
  }

  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }]))
  @ApiConsumes('multipart/form-data')
  @Post('add-teamMember')
  async addTeamMember(
    @Body() registerationData: CreateTeamMemberDto,
    @UploadedFiles()
    files,
  ) {
    let user = await this.UserRepository.findOne({
      role: UserRole.teamMember,
      $or: [
        { phone: registerationData.phone },
        { email: registerationData.email },
        { whatsapp: registerationData.whatsapp },
      ],
    });
    if (user)
      throw new BadRequestException(
        'phone,email and whatsapp should be unique',
      );
    if (files && files.photo)
      registerationData.photo = files.photo[0].secure_url;

    let newUser = await this.UserRepository.createDoc({
      role: UserRole.teamMember,
      enabled: true,
      ...registerationData,
    });
    return newUser;
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateQuery,
  FilterQuery,
  Model,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
  UpdateQuery,
} from 'mongoose';
import { ChangePasswordDto } from 'src/users/dto/change-password.dto';
import { FilterQueryOptionsUser } from './dto/filterQueryOptions.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument, UserRole, UserSchema } from './models/_user.model';
import * as _ from 'lodash';
import { UserRepository } from './users.repository';
import { cacheOperationsService } from 'src/cache/cache-operations.service';
import { GroupService } from 'src/group/group.service';

function randomInRange(from: number, to: number) {
  var r = Math.random();
  return Math.floor(r * (to - from) + from);
}

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly GroupService: GroupService,
  ) { }



  async getCustomeDocs(countriesId: string[]): Promise<UserDocument[]> {
    const docs = await this.userRepository.findAllCustome(countriesId);
    return docs;
  }

  // async findAll(FilterQueryOptionsUser: FilterQueryOptionsUser,)
  // {
  //   return await this.userRepository.findAllWithPaginationCustome(
  //     FilterQueryOptionsUser,
  //     // ['university', 'subject', 'state', 'teamMember', 'nameAr', 'nameEn'],
  //     // { populate: ['group', 'university'] },
  //   );
  // }


  async findAll(
    queryFiltersAndOptions: FilterQueryOptionsUser,
  ): Promise<PaginateResult<UserDocument> | UserDocument[]> {
    // if (queryFiltersAndOptions.university) {
    //   queryFiltersAndOptions.role =
    //     queryFiltersAndOptions.role === undefined
    //       ? UserRole.STUDENT
    //       : queryFiltersAndOptions.role;
    // }
    const users = await this.userRepository.findAllWithPaginationCustome2(
      queryFiltersAndOptions,

      // queryFiltersAndOptions,
      // ['username', 'usernameAr', 'role', 'university', 'collage', 'enabled' ],
      // {
      //   populate: [
      //     {
      //       path: 'university',
      //       select: { nameAr: 1, nameEn: 1, _id: 1 }
      //     },
      //     {
      //       path: 'collage',
      //       select: { nameAr: 1, nameEn: 1, _id: 1 }
      //     }
      //   ]
      // },
    );

    return users;
  }

  async findOne(filter: FilterQuery<UserDocument>): Promise<UserDocument> {
    const user = await this.userRepository.findOne(filter);
    return user;
  }

  async update(
    id: string,
    updateUserData: UpdateUserDto,
  ): Promise<UserDocument> {
    if (updateUserData.phone) {
      let user = await this.userRepository.findOne({
        phone: updateUserData.phone,
      });
      if (user) {
        throw new BadRequestException(
          'phone should be unique',
        );
      }
    }

    if (updateUserData.email) {

      let user = await this.userRepository.findOne({
        email: updateUserData.email
      });
      if (user) {
        throw new BadRequestException(
          'email should be unique',
        );
      }

    }


    if (updateUserData.whatsapp) {

      let user = await this.userRepository.findOne({

        whatsapp: updateUserData.whatsapp

      });
      if (user) {
        throw new BadRequestException(
          ' whatsapp should be unique',
        );

      }

    }
    console.log(id)

    const user = await this.userRepository.updateOne({ id }, updateUserData);
    console.log(user)
    return user;
  }

  async updateTest(
    id: string,
    updateUserData: UpdateUserDto,
  ): Promise<UserDocument> {

    return await this.userRepository.updateUser(id, updateUserData);
  }
  async getProfile(me: UserDocument): Promise<UserDocument> {
    return me;
  }

  async createUser(
    createUserData: CreateQuery<UserDocument>,
  ): Promise<UserDocument> {

    return await this.userRepository.create(createUserData);
  }

  async changePassword(
    { oldPassword, newPassword }: ChangePasswordDto,
    me: UserDocument,
  ): Promise<UserDocument> {
    if (!(await (me as any).isValidPassword(oldPassword)))
      throw new UnauthorizedException('password not match');

    return await this.userRepository.updateOne(
      { _id: me._id } as FilterQuery<UserDocument>,
      { password: newPassword } as UpdateQuery<UserDocument>,
    );
  }

  async testFind(email: string) {
    return await this.userRepository.findUserEmail(email)
  }
  async deleteStudent(_id: string) {
    await this.userRepository.updateOne({ _id }, { enabled: false });
    // await this.GroupService.removeStudent(_id);
  }
}

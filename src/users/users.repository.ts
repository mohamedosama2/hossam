import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PaginateModel, PaginateOptions } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { User, UserDocument, UserRole } from './models/_user.model';
var ObjectId = require('mongodb').ObjectId;
import * as _ from 'lodash';
import { FilterQueryOptionsUser } from './dto/filterQueryOptions.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as moment from 'moment';


@Injectable()
export class UserRepository extends BaseAbstractRepository<User> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
    /*  this.userModel.collection.dropIndex("whatsapp_1")
    this.userModel.collection.dropIndex("phone_1")
    console.log(this.userModel.listIndexes().then((data) => console.log(data))); */
  }

  async findUserEmail(email?: string): Promise<UserDocument> {
    console.log(email)
    const user = await this.userModel.aggregate([{ $match: { email: email } }])
    // console.log('user======================')
    // console.log(user)

    return user[0];
  }
  // public async findAllWithPaginationCustome(
  //   @AuthUser() me: UserDocument,
  //   queryFiltersAndOptions: any,
  // ): Promise<TaskDocument[]> {
  //   console.log(queryFiltersAndOptions);

  //   let filters: FilterQuery<TaskDocument> = _.pick(queryFiltersAndOptions, [
  //     'university',
  //     'from',
  //     'to',
  //     'subject',
  //     'teamMember',
  //     'state',
  //     'TaskType',
  //     'nameEn',
  //     'nameAr',
  //     'group',
  //     'collage',
  //     'isDeletedTask',
  //     'isAdminTask',
  //   ]);
  //   console.log('here');
  //   const options: PaginateOptions = _.pick(queryFiltersAndOptions, [
  //     'page',
  //     'limit',
  //   ]);
  //   let query = {
  //     ...(me.role === 'admin' &&
  //       queryFiltersAndOptions.teamMember && {
  //       'taskManager.id': queryFiltersAndOptions.teamMember,
  //     }),
  //     ...(me.role === 'admin' &&
  //       queryFiltersAndOptions.taskType && {
  //       taskType: queryFiltersAndOptions.taskType,
  //     }),
  //     ...(me.role === UserRole.teamMember && {
  //       'taskManager.id': me._id,
  //     }),

  //     ...(queryFiltersAndOptions.isDeletedTask !== null &&
  //       queryFiltersAndOptions.isDeletedTask !== undefined && {
  //       isDeletedTask:
  //         queryFiltersAndOptions.isDeletedTask == ('true' as any)
  //           ? { $ne: false, $exists: true }
  //           : { $ne: true },
  //     }),

  //     ...(queryFiltersAndOptions.isAdminTask !== null &&
  //       queryFiltersAndOptions.isAdminTask !== undefined && {
  //       isAdminTask:
  //         queryFiltersAndOptions.isAdminTask == ('true' as any)
  //           ? { $ne: false, $exists: true }
  //           : { $ne: true },
  //     }),

  //     // ...{
  //     //   isDeletedTask: queryFiltersAndOptions.isDeletedTask,
  //     // },

  //     ...((queryFiltersAndOptions.from || queryFiltersAndOptions.to) && {
  //       createdAt: {
  //         ...(queryFiltersAndOptions.from && {
  //           $gte: moment(queryFiltersAndOptions.from)
  //             .utc()
  //             .startOf('d')
  //             .toDate(),
  //         }),
  //         ...(queryFiltersAndOptions.to && {
  //           $lte: moment(queryFiltersAndOptions.to).utc().endOf('d').toDate(),
  //         }),
  //       },
  //     }),
  //     ...(queryFiltersAndOptions.nameEn && {
  //       nameEn: queryFiltersAndOptions.nameEn,
  //     }),
  //     ...(queryFiltersAndOptions.nameAr && {
  //       nameAr: queryFiltersAndOptions.nameAr,
  //     }),
  //     ...(queryFiltersAndOptions.group && {
  //       group: ObjectId(queryFiltersAndOptions.group),
  //     }),

  //     ...(queryFiltersAndOptions.collage && {
  //       collage: ObjectId(queryFiltersAndOptions.collage),
  //     }),
  //     ...(queryFiltersAndOptions.teamMember && {
  //       'taskManager.id': ObjectId(queryFiltersAndOptions.teamMember),
  //     }),
  //     ...(queryFiltersAndOptions.subject && {
  //       subject: ObjectId(queryFiltersAndOptions.subject),
  //     }),
  //     ...(queryFiltersAndOptions.university && {
  //       university: ObjectId(queryFiltersAndOptions.university),
  //     }),
  //     ...(queryFiltersAndOptions.state && {
  //       state: queryFiltersAndOptions.state,
  //     }),
  //   };
  //   delete filters.subject;
  //   delete filters.nameAr;
  //   delete filters.nameEn;
  //   delete filters.state;
  //   delete filters.university;
  //   delete filters.group;
  //   delete filters.teamMember;
  //   delete filters.from;
  //   delete filters.to;
  //   delete filters.isDeletedTask;

  //   let docs;
  //   console.log(filters);
  //   console.log(query);
  //   if (queryFiltersAndOptions.allowPagination) {
  //     docs = await (this.taskModel as PaginateModel<TaskDocument>).paginate(
  //       // here we can but any option to to query like sort
  //       {
  //         filters,
  //         ...query,
  //       },
  //       {
  //         ...options,
  //         populate: ['group', 'university', 'student', 'collage', 'subject'],
  //       },
  //     );
  //   } else {
  //     docs = await this.taskModel
  //       .find({
  //         filters,
  //         ...query,
  //       })
  //       .populate(['group', 'university', 'student', 'collage', 'subject']);
  //   }
  //   return docs;
  // }
  async findUser(phone?: string, whatsapp?: string, email?: string, role?: UserRole): Promise<UserDocument> {
    let query = {
      role: role,

    }
    const user = await this.userModel.aggregate([
      {
        $match: {
          role: role,
          $or: [
            {
              phone: phone,
            },
            {
              email: email,
            }
            // role: UserRole.teamMember, 'whatsapp': registerationData.whatsapp
          ]
        }
      }
    ])
    return user[0];
  }

  async updateUser(id: string, updateUserData: UpdateUserDto) {
    let existUser = await this.userModel.findById(id)
    if (!existUser) throw new BadRequestException('user not found',);

    if (updateUserData.phone) {
      console.log('inside')
      let query = {
        $or: [
          { 'phone': updateUserData.phone },
          // { $and: [{ 'whatsapp': updateUserData.phone }, { role: UserRole.teamMember }] }
        ]
      }
      console.log(query.$or)
      let user = await this.userModel.findOne({
        $or: [
          { 'phone': updateUserData.phone },
          { role: UserRole.teamMember, 'whatsapp': updateUserData.phone }
        ]
      });
      console.log(user)
      if (user) {
        throw new BadRequestException(
          'phone should be unique',
        );
      }
    }

    if (updateUserData.email) {

      let user = await this.userModel.findOne({
        email: updateUserData.email
      });
      if (user) {
        throw new BadRequestException(
          'email should be unique',
        );
      }
    }
    if (updateUserData.whatsapp) {
      let user = await this.userModel.findOne({
        $or: [
          { 'phone': updateUserData.whatsapp },
          { role: UserRole.teamMember, 'whatsapp': updateUserData.whatsapp }
        ]
      });
      console.log(user)
      if (user) {
        throw new BadRequestException(
          ' whatsapp should be unique',
        );
      }
    }

    await existUser.set(updateUserData).save()

    return existUser
    // let updateUser = await this.userModel.updateOne()
  }

  async coudeStudents() {
    const students = await this.userModel.countDocuments({
      role: UserRole.STUDENT,
    });
    const teamMembers = await this.userModel.countDocuments({
      role: UserRole.teamMember,
    });
    return { students, teamMembers };
  }

  findAllCustome(options?: string[]) {
    return this.userModel.find({ _id: { $in: options } });

  }

  async fetchUsersByFilter(
    filter: FilterQuery<UserDocument>,
    stage = 0,
  ): Promise<UserDocument[]> {
    return await this.userModel
      .find(filter)
      .skip(5000 * stage)
      .limit(5000)
      .select('_id pushTokens');
  }

  async fetchShouldSend() {
    return await this.userModel.countDocuments({
      'pushTokens.0': { $exists: true },
    });
  }

  async fetchCounts(filter: FilterQuery<UserDocument>): Promise<number> {
    const count = await this.userModel.aggregate([
      { $match: filter },
      { $count: 'usersCount' },
    ]);
    return count[0].usersCount as number;
  }
  async fetchAllTokensChunks(
    filter: FilterQuery<UserDocument>,
    stage = 0,
  ): Promise<{
    arrayOfObjects: { deviceToken: string; _id: string }[];
    arrayOfUsersIds: string[];
  }> {
    const chunk = await this.userModel.aggregate([
      { $match: filter },
      { $skip: stage * 1000 },
      { $limit: 1000 },
      { $project: { pushTokens: 1, _id: 1 /* , username: 1 */ } },
      {
        $facet: {
          arrayOfUsersIds: [
            { $project: { _id: 1 } },
            { $group: { _id: null, usersIds: { $push: '$_id' } } },
            { $project: { _id: 0 } },
          ],
          arrayOfObjects: [
            { $unwind: { path: '$pushTokens' } },
            { $project: { deviceToken: '$pushTokens.deviceToken' } },
          ],
        },
      },
      {
        $project: {
          arrayOfUsersIds: '$arrayOfUsersIds.usersIds',
          arrayOfObjects: 1,
        },
      },
      { $unwind: '$arrayOfUsersIds' },
    ]);
    return chunk[0];
  }

  public async findAllWithPaginationCustome(
    // @AuthUser() me: UserDocument,
    FilterQueryOptionsUser: any,
  ): Promise<UserDocument[]> {
    console.log(FilterQueryOptionsUser);

    let filters: FilterQuery<UserDocument> = _.pick(FilterQueryOptionsUser, [
      'university',
      'username',
      'usernameAr',
      'role', 'collage', 'enabled', 'from', 'to'
    ]);
    console.log('here');
    const options: PaginateOptions = _.pick(FilterQueryOptionsUser, [
      'page',
      'limit',
    ]);
    let query = {
      ...((FilterQueryOptionsUser.from || FilterQueryOptionsUser.to) && {
        enrolmentDate: {
          ...(FilterQueryOptionsUser.from && {
            $gte: moment(FilterQueryOptionsUser.from)
              .utc()
              .startOf('d')
              .toDate(),
          }),
          ...(FilterQueryOptionsUser.to && {
            $lte: moment(FilterQueryOptionsUser.to).utc().endOf('d').toDate(),
          }),
        },
      }),
      ...(FilterQueryOptionsUser.username && {
        username: {
          $regex: `.*${FilterQueryOptionsUser.username}.*`,
          $options: 'i',
        },
      }),
      ...(FilterQueryOptionsUser.usernameAr && {
        usernameAr: {
          $regex: `.*${FilterQueryOptionsUser.usernameAr}.*`,
          $options: 'i',
        },
      }),
      ...(FilterQueryOptionsUser.university && {
        university: ObjectId(FilterQueryOptionsUser.university),
      }),
      ...(FilterQueryOptionsUser.role && { role: FilterQueryOptionsUser.role }),

      ...(FilterQueryOptionsUser.enabled !== null &&
        FilterQueryOptionsUser.enable !== undefined && {
        enabled:
          FilterQueryOptionsUser.enabled == ('true' as any)
            ? { $ne: false, $exists: true }
            : { $ne: true },
      }),
    };
    delete filters.university;
    delete filters.role;
    delete filters.username;
    delete filters.usernameAr;
    delete filters.from;
    delete filters.to;
    delete filters.collage;
    delete filters.enabled;
    let docs;
    console.log(filters);
    console.log(query);
    if (FilterQueryOptionsUser.allowPagination) {
      docs = await (this.userModel as PaginateModel<UserDocument>).paginate(
        // here we can but any option to to query like sort
        {
          ...query,
        },
        {
          ...options,
          populate: [{
            path: 'university',
            select: { nameAr: 1, nameEn: 1, _id: 1 },


          },

          {
            path: 'collage',
            select: { nameAr: 1, nameEn: 1, _id: 1 }
          }

          ],
          // populate: ['group', 'university']
        },
      );
    } else {
      docs = await this.userModel
        .find({
          filters,
          ...query,
        })
        .populate({
          path: 'university',
          select: { nameAr: 1, nameEn: 1, _id: 1 },
        }, {
          path: 'collage',
          select: { nameAr: 1, nameEn: 1, _id: 1 }
        });
    }
    return docs;
  }

  public async findAllWithPaginationCustome2(
    // @AuthUser() me: UserDocument,
    queryFiltersAndOptions: any,
  ): Promise<UserDocument[]> {
    console.log(queryFiltersAndOptions);

    let filters: FilterQuery<UserDocument> = _.pick(queryFiltersAndOptions, [
      'enabled',
      'username',
      'usernameAr',
      'role',
      'jobTitle',
      'university',
      'collage',
      'from',
      'to'
    ]);
    console.log('here');
    const options: PaginateOptions = _.pick(queryFiltersAndOptions, [
      'page',
      'limit',
    ]);


    let query = {
      ...((queryFiltersAndOptions.from || queryFiltersAndOptions.to) && {
        createdAt: {
          ...(queryFiltersAndOptions.from && {
            $gte: moment(queryFiltersAndOptions.from)
              .utc()
              .startOf('d')
              .toDate(),
          }),
          ...(queryFiltersAndOptions.to && {
            $lte: moment(queryFiltersAndOptions.to).utc().endOf('d').toDate(),
          }),
        },
      }),
      ...(queryFiltersAndOptions.username && {
        username: {
          $regex: `.*${queryFiltersAndOptions.username}.*`,
          $options: 'i',
        },
      }),
      ...(queryFiltersAndOptions.usernameAr && {
        usernameAr: {
          $regex: `.*${queryFiltersAndOptions.usernameAr}.*`,
          $options: 'i',
        },
      }),
      ...(queryFiltersAndOptions.university && {
        university: ObjectId(queryFiltersAndOptions.university),
      }),
      ...(queryFiltersAndOptions.collage && {
        collage: ObjectId(queryFiltersAndOptions.collage),
      }),
      ...(queryFiltersAndOptions.role && { role: queryFiltersAndOptions.role }),
      ...(queryFiltersAndOptions.jobTitle && { jobTitle: queryFiltersAndOptions.jobTitle }),

      ...(queryFiltersAndOptions.enabled !== null &&
        queryFiltersAndOptions.enabled !== undefined && {
        enabled:
          queryFiltersAndOptions.enabled == ('true' as any)
            ? { $ne: false, $exists: true }
            : { $ne: true },
      }),

      // jobTitle: "DEVELOPER"
    };
    delete filters.university;
    delete filters.role;
    delete filters.role;
    delete filters.JopTitle;
    delete filters.usernameAr;
    delete filters.from;
    delete filters.to;
    delete filters.collage;
    delete filters.enabled;

    let docs;

    if (queryFiltersAndOptions.allowPagination) {
      docs = await (this.userModel as PaginateModel<UserDocument>).paginate(
        // here we can but any option to to query like sort
        {
          filters,
          ...query,
        },
        {
          ...options,
          populate: [{
            path: 'university',
            select: { nameAr: 1, nameEn: 1, _id: 1 },


          },

          {
            path: 'collage',
            select: { nameAr: 1, nameEn: 1, _id: 1 }
          }

          ],

        },




      );
    } else {
      docs = await this.userModel
        .find({
          filters,
          ...query,
        })
        .populate([{
          path: 'university',
          select: { nameAr: 1, nameEn: 1, _id: 1 },
        }, {
          path: 'collage',
          select: { nameAr: 1, nameEn: 1, _id: 1 }
        }]);
      // .populate(['group', 'university', 'student', 'collage', 'subject']);
    }
    return docs;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PaginateModel, PaginateOptions } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { User, UserDocument, UserRole } from './models/_user.model';
var ObjectId = require('mongodb').ObjectId;
import * as _ from 'lodash';
import { FilterQueryOptionsUser } from './dto/filterQueryOptions.dto';


@Injectable()
export class UserRepository extends BaseAbstractRepository<User> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>)
  {
    super(userModel);
    /*  this.userModel.collection.dropIndex("whatsapp_1")
    this.userModel.collection.dropIndex("phone_1")
    console.log(this.userModel.listIndexes().then((data) => console.log(data))); */
  }

  async coudeStudents()
  {
    const students = await this.userModel.countDocuments({
      role: UserRole.STUDENT,
    });
    const teamMembers = await this.userModel.countDocuments({
      role: UserRole.teamMember,
    });
    return { students, teamMembers };
  }

  findAllCustome(options?: string[])
  {
    return this.userModel.find({ _id: { $in: options } });

  }

  async fetchUsersByFilter(
    filter: FilterQuery<UserDocument>,
    stage = 0,
  ): Promise<UserDocument[]>
  {
    return await this.userModel
      .find(filter)
      .skip(5000 * stage)
      .limit(5000)
      .select('_id pushTokens');
  }

  async fetchShouldSend()
  {
    return await this.userModel.countDocuments({
      'pushTokens.0': { $exists: true },
    });
  }

  async fetchCounts(filter: FilterQuery<UserDocument>): Promise<number>
  {
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
  }>
  {
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
    queryFiltersAndOptions: any,
  ): Promise<UserDocument[]>
  {
    console.log(queryFiltersAndOptions)

    let filters: FilterQuery<UserDocument> = _.pick(queryFiltersAndOptions, [
      'university',
      'from',
      'to',
      'subject',
      'teamMember',
      'state',
      'nameEn',
      'nameAr',
      'group'
    ]);
    console.log('here')
    const options: PaginateOptions = _.pick(queryFiltersAndOptions, [
      'page',
      'limit',
    ]);
    let query = {
      // ...(me.role === 'admin' && queryFiltersAndOptions.teamMember
      //   && {
      //   'taskManager.id': queryFiltersAndOptions.teamMember,

      // }),
      // ...(me.role === UserRole.teamMember && {
      //   'taskManager.id': me._id,
      // }),
      ...(queryFiltersAndOptions.username && {

        "username": { $regex: `.*${queryFiltersAndOptions.username}.*`, $options: "i" }

      }),
      ...(queryFiltersAndOptions.university && { university: ObjectId(queryFiltersAndOptions.university) }),
      ...(queryFiltersAndOptions.role && { role: queryFiltersAndOptions.role }),
    }
    delete filters.university
    delete filters.role
    delete filters.username
    let docs;
    console.log(filters)
    console.log(query)
    if (queryFiltersAndOptions.allowPagination)
    {
      docs = await (this.userModel as PaginateModel<UserDocument>).paginate(
        // here we can but any option to to query like sort
        {

          ...query
        },
        {
          ...options,
          populate: {
            path: 'university',
            select: { nameAr: 1, nameEn: 1, _id: 1 },
          },
          // populate: ['group', 'university']
        }
      );
    } else
    {
      docs = await this.userModel.find({
        filters,
        ...query
      }).populate({
        path: 'university',
        select: { nameAr: 1, nameEn: 1, _id: 1 },
      })
    }
    return docs;
  }
}

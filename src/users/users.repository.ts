import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { User, UserDocument, UserRole } from './models/_user.model';

@Injectable()
export class UserRepository extends BaseAbstractRepository<User> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
    /*  this.userModel.collection.dropIndex("whatsapp_1")
    this.userModel.collection.dropIndex("phone_1")
    console.log(this.userModel.listIndexes().then((data) => console.log(data))); */
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
}

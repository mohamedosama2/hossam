import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Group, GroupDocument } from './models/group.model';

@Injectable()
export class GroupRepository extends BaseAbstractRepository<Group> {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {
    super(groupModel);
  }
  async pullStudent(_id: string) {
    await this.groupModel.updateMany(
      {},
      {
        $pull: {
          students: {
            student: {
              $eq: _id,
            },
          },
        } as any,
      },
    );
  }
}

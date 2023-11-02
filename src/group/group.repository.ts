import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PaginateOptions } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Group, GroupDocument } from './models/group.model';
import { FilterQueryOptionsGroup } from './dto/filter.dto';
import * as _ from 'lodash';
import { PaginateModel } from 'mongoose';
var ObjectId = require('mongodb').ObjectId;

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

  public async findAllWithPaginationCustome(
    queryFiltersAndOptions: FilterQueryOptionsGroup,
  ): Promise<GroupDocument[]> {
    console.log(queryFiltersAndOptions);

    let filters: FilterQuery<GroupDocument> = _.pick(queryFiltersAndOptions, [
      'name', 'enable', 'university', 'collage', 'student'
    ]);
    console.log('here');
    const options: PaginateOptions = _.pick(queryFiltersAndOptions, [
      'page',
      'limit',
    ]);
    let query = {
      ...(queryFiltersAndOptions.enable !== null &&
        queryFiltersAndOptions.enable !== undefined && {
        enable:
          queryFiltersAndOptions.enable == ('true' as any)
            ? { $ne: false, $exists: true }
            : { $ne: true },
      }),
      ...(queryFiltersAndOptions.name && {
        name: {
          $regex: `.*${queryFiltersAndOptions.name}.*`,
          $options: 'i',
        },
      }),

      ...(queryFiltersAndOptions.collage && {
        collage: ObjectId(queryFiltersAndOptions.collage),
      }),

      ...(queryFiltersAndOptions.student && {
        "students.student": ObjectId(queryFiltersAndOptions.student),
      }),

      ...(queryFiltersAndOptions.university && {
        university: ObjectId(queryFiltersAndOptions.university),
      }),



    };
    delete filters.name;
    delete filters.enable;
    delete filters.university;
    delete filters.collage;
    delete filters.student;
    let docs;
    console.log(filters);
    console.log(query);
    if (queryFiltersAndOptions.allowPagination) {
      docs = await (this.groupModel as PaginateModel<GroupDocument>).paginate(
        // here we can but any option to to query like sort
        {
          filters,
          ...query,
        },
        {
          ...options,
          populate: ['students.student', 'university', 'collage'],
        },
      );
    } else {
      docs = await this.groupModel
        .find({
          filters,
          ...query,
        })
        .populate(['students.student', 'university', 'collage']);
    }
    return docs;
  }
}

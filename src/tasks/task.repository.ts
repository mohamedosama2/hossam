import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
} from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Task, TaskDocument } from './models/task.model';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AuthUser } from 'src/auth/decorators/me.decorator';
import { UserDocument, UserRole } from 'src/users/models/_user.model';
var ObjectId = require('mongodb').ObjectId;

/* function addDays(days) {
  var date = new Date(this.valueOf());
 
  return date;
}
 */
@Injectable()
export class TaskRepository extends BaseAbstractRepository<Task> {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {
    super(taskModel);
  }


  async findAllTotalTeamMember(teamMember: string) {
    let stages = [
      {
        $match: {
          taskManager: ObjectId(teamMember),
          // paymentType: PaymentType.EXPENSIS,
        },
      },
      {
        $group: {
          _id: null,
          totalExpensis: { $sum: '$totalPriceTeamMember' },
        },
      },
    ];
    console.log(stages);
    let mony = await this.taskModel.aggregate(stages);
    return mony[0];

  }

  async getTasksProgress() {
    console.log(new Date());
    const tasksInProgress = await this.taskModel.countDocuments({
      endDate: { $lte: new Date() },
    });
    const tasksFinished = await this.taskModel.countDocuments({
      endDate: { $gt: new Date() },
    });
    return { tasksInProgress, tasksFinished };
  }

  async getHone(date: Date, @AuthUser() me: UserDocument) {
    let strartDate = new Date(date);
    const endDate = date.setDate(date.getDate() + 30);
    return await this.taskModel.aggregate([
      {
        $addFields: {
          startDate: { $toDate: '$startDate' },
        },
      },
      {
        $match: {
          $and: [
            { startDate: { $gte: new Date(strartDate) } },
            { startDate: { $lte: new Date(endDate) } },
          ],
          ...(me.role === UserRole.teamMember && {
            'taskManager.id': me._id,
          }),
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfWeek: '$startDate' },
            taskManager: '$taskManager',
          },
          task: { $push: '$$ROOT' },
          day: { $first: '$startDate' },
        },
      },
    ]);
  }

  async getWeek(date: Date, @AuthUser() me: UserDocument) {
    let strartDate = new Date(date);
    const endDate = date.setDate(date.getDate() + 30);
    /*  console.log(date); */
    console.log(strartDate);
    console.log(date);
    console.log(new Date(endDate));

    return await this.taskModel.aggregate([
      {
        $addFields: {
          startDate: { $toDate: '$startDate' },
        },
      },
      {
        $match: {
          $and: [
            { startDate: { $gte: new Date(strartDate) } },
            { startDate: { $lte: new Date(endDate) } },
          ],
          ...(me.role === UserRole.teamMember && {
            'taskManager.id': me._id,
          }),
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$startDate' },
          task: { $push: '$$ROOT' },
          day: { $first: '$startDate' },
        },
      },
    ]);
  }
  async findPopulatedTask(taskId: string) {
    const task = await this.taskModel.findOne({ _id: taskId }).populate({
      path: 'group',
      populate: {
        path: 'students',
        populate: {
          path: 'student',
        },
      },
    });
    return task;
  }

  public async findAllWithPaginationCustome(
    @AuthUser() me: UserDocument,
    queryFiltersAndOptions: any,
  ): Promise<TaskDocument[]> {
    console.log(queryFiltersAndOptions);

    let filters: FilterQuery<TaskDocument> = _.pick(queryFiltersAndOptions, [
      'university',
      'from',
      'to',
      'subject',
      'teamMember',
      'state',
      'TaskType',
      'taskFor',
      'semester',
      'nameEn',
      'nameAr',
      'group',
      'collage',
      'isDeletedTask',
      'isAdminTask',
    ]);
    console.log('here');
    const options: PaginateOptions = _.pick(queryFiltersAndOptions, [
      'page',
      'limit',
    ]);
    let query = {
      ...(me.role === 'admin' &&
        queryFiltersAndOptions.teamMember && {
        'taskManager.id': queryFiltersAndOptions.teamMember,
      }),
      ...(me.role === 'admin' &&
        queryFiltersAndOptions.taskType && {
        taskType: queryFiltersAndOptions.taskType,
      }),
      ...(me.role === 'admin' &&
        queryFiltersAndOptions.semester && {
        semester: queryFiltersAndOptions.semester,
      }),
      ...(me.role === UserRole.teamMember && {
        'taskManager.id': me._id,
      }),

      ...(queryFiltersAndOptions.isDeletedTask !== null &&
        queryFiltersAndOptions.isDeletedTask !== undefined && {
        isDeletedTask:
          queryFiltersAndOptions.isDeletedTask == ('true' as any)
            ? { $ne: false, $exists: true }
            : { $ne: true },
      }),

      ...(queryFiltersAndOptions.isAdminTask !== null &&
        queryFiltersAndOptions.isAdminTask !== undefined && {
        isAdminTask:
          queryFiltersAndOptions.isAdminTask == ('true' as any)
            ? { $ne: false, $exists: true }
            : { $ne: true },
      }),

      // ...{
      //   isDeletedTask: queryFiltersAndOptions.isDeletedTask,
      // },

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
      ...(queryFiltersAndOptions.nameEn && {
        nameEn: queryFiltersAndOptions.nameEn,
      }),

      ...(queryFiltersAndOptions.nameAr && {
        nameAr: queryFiltersAndOptions.nameAr,
      }),
      ...(queryFiltersAndOptions.lecture && {
        lecture: queryFiltersAndOptions.lecture,
      }),
      ...(queryFiltersAndOptions.group && {
        group: ObjectId(queryFiltersAndOptions.group),
      }),

      ...(queryFiltersAndOptions.collage && {
        collage: ObjectId(queryFiltersAndOptions.collage),
      }),
      ...(queryFiltersAndOptions.teamMember && {
        'taskManager.id': ObjectId(queryFiltersAndOptions.teamMember),
      }),
      ...(queryFiltersAndOptions.subject && {
        subject: ObjectId(queryFiltersAndOptions.subject),
      }),
      ...(queryFiltersAndOptions.university && {
        university: ObjectId(queryFiltersAndOptions.university),
      }),
      ...(queryFiltersAndOptions.state && {
        state: queryFiltersAndOptions.state,
      }),

      ...(queryFiltersAndOptions.taskFor && {
        taskFor: queryFiltersAndOptions.taskFor,
      }),
    };
    delete filters.subject;
    delete filters.nameAr;
    delete filters.nameEn;
    delete filters.state;
    delete filters.university;
    delete filters.group;
    delete filters.teamMember;
    delete filters.from;
    delete filters.to;
    delete filters.isDeletedTask;

    let docs;
    console.log(filters);
    console.log(query);
    if (queryFiltersAndOptions.allowPagination) {
      docs = await (this.taskModel as PaginateModel<TaskDocument>).paginate(
        // here we can but any option to to query like sort
        {
          filters,
          ...query,
        },
        {
          ...options,
          populate: ['group', 'university', 'student', 'collage', 'subject'],
        },
      );
    } else {
      docs = await this.taskModel
        .find({
          filters,
          ...query,
        })
        .populate(['group', 'university', 'student', 'collage', 'subject']);
    }
    return docs;
  }

  public async allTeamMemberMony(tramMember: string) {
    let stages = [
      {
        $match: {
          'taskManager.id': ObjectId(tramMember),
        },
      },
      {
        $group: {
          _id: null,
          totalmony: { $sum: '$totalPriceTeamMember' },
        },
      },
    ];
    console.log(stages);
    let mony = await this.taskModel.aggregate(stages);
    return mony[0];
  }
}

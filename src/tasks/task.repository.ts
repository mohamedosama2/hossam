import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Task, TaskDocument } from './models/task.model';
import * as _ from 'lodash';
import * as moment from "moment"

/* function addDays(days) {
  var date = new Date(this.valueOf());
 
  return date;
}
 */
@Injectable()
export class TaskRepository extends BaseAbstractRepository<Task> {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>)
  {
    super(taskModel);
  }

  async getTasksProgress()
  {
    console.log(new Date());
    const tasksInProgress = await this.taskModel.countDocuments({
      endDate: { $lte: new Date() },
    });
    const tasksFinished = await this.taskModel.countDocuments({
      endDate: { $gt: new Date() },
    });
    return { tasksInProgress, tasksFinished };
  }

  async getHone(date: Date)
  {
    let strartDate = new Date(date);
    const endDate = date.setDate(date.getDate() + 6);
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

  async getWeek(date: Date)
  {
    let strartDate = new Date(date);
    const endDate = date.setDate(date.getDate() + 6);
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
  async findPopulatedTask(taskId: string)
  {
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

  // public async findAllWithPaginationOption(
  //   queryFiltersAndOptions: any,
  //   arrayOfFilters: string[],
  //   extraOptions: PaginateOptions = {},
  // ): Promise<PaginateResult<TaskDocument> | TaskDocument[]>
  // {
  //   const filters: FilterQuery<TaskDocument> = _.pick(
  //     queryFiltersAndOptions,
  //     arrayOfFilters,
  //   );
  //   const options: PaginateOptions = _.pick(queryFiltersAndOptions, [
  //     'page',
  //     'limit',
  //   ]);
  //   let docs;
  //   if (queryFiltersAndOptions.allowPagination)
  //   {
  //     docs = await (this.taskModel as PaginateModel<TaskDocument>).paginate(
  //       filters,
  //       { ...options, ...extraOptions },
  //     );
  //   } else
  //   {
  //     docs = await this.taskModel.find(filters).setOptions(options);
  //   }
  //   return docs;
  // }


  public async findAllWithPaginationCustome(
    queryFiltersAndOptions: any,
  ): Promise<TaskDocument[]>
  {
    console.log(queryFiltersAndOptions)

    let filters: FilterQuery<TaskDocument> = _.pick(queryFiltersAndOptions, [
      'university',
      'from',
      'to',
      'subject',
      'teamMember',
      'state',
      'nameEn',
      'nameAr',
    ]);
    console.log('here')
    const options: PaginateOptions = _.pick(queryFiltersAndOptions, [
      'page',
      'limit',
    ]);
    let query = {
      ...((queryFiltersAndOptions.from || queryFiltersAndOptions.to) && {
        createdAt: {
          ...(queryFiltersAndOptions.from && { $gte: moment(queryFiltersAndOptions.from).utc().startOf('d').toDate(), }),
          ...(queryFiltersAndOptions.to && { $lte: moment(queryFiltersAndOptions.to).utc().endOf('d').toDate(), })
        }
      })
    }

    delete filters.from
    delete filters.to


    let docs;
    console.log(filters)
    console.log(query)
    if (queryFiltersAndOptions.allowPagination)
    {
      docs = await (this.taskModel as PaginateModel<TaskDocument>).paginate(
        // here we can but any option to to query like sort
        {
          filters,
          ...query
        },
        {
          ...options,
          populate: ['group', 'university']
        }
      );
    } else
    {
      docs = await this.taskModel.find({
        filters,
        ...query
      },).populate(['group', 'university'])
    }
    return docs;
  }
}

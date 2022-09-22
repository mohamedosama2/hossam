import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Task, TaskDocument } from './models/task.model';

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

  async getHone(date: Date) {
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

  async getWeek(date: Date) {
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
}

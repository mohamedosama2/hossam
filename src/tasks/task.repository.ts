import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Task, TaskDocument } from './models/task.model';

@Injectable()
export class TaskRepository extends BaseAbstractRepository<Task> {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {
    super(taskModel);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentService } from 'src/payment/payment.service';
import { CreatePaymentTaskDto, CreateTaskDto } from './dto/create-task.dto';
import { FilterQueryOptionsTasks, FilterQueryTasks } from './dto/filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService
{
  constructor(
    private readonly TaskRepository: TaskRepository,
    private readonly PaymentService: PaymentService,
  ) { }
  async create(createTaskDto: CreateTaskDto)
  {
    const payment = createTaskDto.payment as CreatePaymentTaskDto;
    delete createTaskDto.payment;
    let task = await this.TaskRepository.create(createTaskDto);
    if (payment)
    {
      await this.PaymentService.create({
        ...payment,
        task: task._id,
      });
    }
    return task;
  }

  async findAll(FilterQueryOptionsTasks: FilterQueryOptionsTasks)
  {
    return await this.TaskRepository.findAllWithPaginationOption(
      FilterQueryOptionsTasks,
      ['university', 'subject', 'status'],
      { populate: ['group', 'university'] },
    );
  }


  async findOne(_id: string)
  {
    const isExisted = await this.TaskRepository.findOne({ _id });
    if (!isExisted) throw new NotFoundException();
    return isExisted;
  }


  async update(_id: string, updateTaskDto: UpdateTaskDto)
  {
    // await this.findOne(_id);
    return await this.TaskRepository.updateOne({ _id }, updateTaskDto);
  }

  async deleteTask(id: string)
  {
    return await this.TaskRepository.deleteOne({ _id: id });
  }

}

import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { PaymentType } from 'src/payment/models/payment.model';
import { PaymentService } from 'src/payment/payment.service';
import { StudentDocument } from 'src/users/models/student.model';
import { UsersService } from 'src/users/users.service';
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
    private readonly usersService: UsersService,
    private readonly NotificationService: NotificationService,
  ) { }
  async create(createTaskDto: CreateTaskDto)
  {
    // let manager = await this.usersService.findOne({ _id: createTaskDto.taskManager.id })
    // if (!manager) throw new NotFoundException('user not found')
    const payment = createTaskDto.payment as CreatePaymentTaskDto;
    // createTaskDto.taskManager.id = manager._id
    // createTaskDto.taskManager.name = manager.username
    console.log(createTaskDto.taskManager)
    delete createTaskDto.payment;
    let task = await this.TaskRepository.create(createTaskDto as any);
    if (payment)
    {
      await this.PaymentService.create({
        ...payment,
        task: task._id,
        paymentType: PaymentType.REVENUSE,
      });
    }
    const taskGroup = await this.TaskRepository.findPopulatedTask(task._id);
    const tokens = [];
    ((taskGroup.group as any).students as any[]).forEach(({ student }) =>
    {
      /*    console.log('St', student); */
      student.pushTokens.forEach(({ deviceToken }) =>
      {
        /*  console.log('St2', deviceToken); */
        tokens.push({
          deviceToken: deviceToken ? deviceToken : 'testing',
          _id: student._id,
        });
      });
    });

    /*     console.log((taskGroup.group as any).students); */
    await this.NotificationService.sendMany(
      {
        body: task.subject,
        title: task.nameAr + task.nameEn,
      },
      tokens,
    );
    return task;
  }

  async findAll(FilterQueryOptionsTasks: FilterQueryOptionsTasks)
  {
    return await this.TaskRepository.findAllWithPaginationOption(
      FilterQueryOptionsTasks,
      ['university', 'subject', 'state', 'teamMember'],
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
    if (updateTaskDto.taskManager.id)
    {
      let manager = await this.usersService.findOne({ _id: updateTaskDto.taskManager.id })
      if (!manager) throw new NotFoundException('user not found')
      updateTaskDto.taskManager.id = manager._id
      updateTaskDto.taskManager.name = manager.username
    }
    // await this.findOne(_id);
    return await this.TaskRepository.updateOne({ _id }, updateTaskDto as any);
  }

  async deleteTask(id: string)
  {
    return await this.TaskRepository.deleteOne({ _id: id });
  }

  async getWeek(date: Date)
  {
    return await this.TaskRepository.getWeek(date);
  }
}

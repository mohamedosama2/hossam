import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/me.decorator';
import { NotificationService } from 'src/notification/notification.service';
import { PaymentType } from 'src/payment/models/payment.model';
import { PaymentService } from 'src/payment/payment.service';
import { StudentDocument } from 'src/users/models/student.model';
import { UserDocument } from 'src/users/models/_user.model';
import { UserRepository } from 'src/users/users.repository';
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
    private readonly UserRepository: UserRepository,
  ) { }
  async create(createTaskDto: CreateTaskDto)
  {
    const payment = createTaskDto.payment as CreatePaymentTaskDto;
    // let manager = await this.usersService.findOne({ _id: createTaskDto.taskManager.id })
    // createTaskDto.taskManager.id = manager._id
    // createTaskDto.taskManager.name = manager.username
    // console.log(createTaskDto.taskManager)
    delete createTaskDto.payment;
    let task = await this.TaskRepository.create(createTaskDto);
    if (payment)
    {
      await this.PaymentService.create({
        ...payment,
        task: task._id,
        paymentType: PaymentType.REVENUSE,
        teamMember: createTaskDto.taskManager as any
      });
    }
    if (createTaskDto.group)
    {
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
    }
    return task;
  }

  async getHome(date: Date, @AuthUser() me: UserDocument)
  {
    const res = await this.TaskRepository.getTasksProgress();
    const studentRes = await this.UserRepository.coudeStudents();
    console.log(res, studentRes);
    const calender = await this.TaskRepository.getHone(date, me);
    return {
      ...res,
      ...studentRes,
      calender,
    };
  }



  async findAll(FilterQueryOptionsTasks: FilterQueryOptionsTasks,
    @AuthUser() me: UserDocument
  )
  {


    return await this.TaskRepository.findAllWithPaginationCustome(
      me,
      FilterQueryOptionsTasks,
      // ['university', 'subject', 'state', 'teamMember', 'nameAr', 'nameEn'],
      // { populate: ['group', 'university'] },
    );
  }

  async findOne(_id: string)
  {
    const isExisted = await this.TaskRepository.findOne({ _id });
    if (!isExisted) throw new NotFoundException();
    return isExisted;
  }

  async teamMemberMony(teamMember: string)
  {
    console.log('here')
    return await this.TaskRepository.allTeamMemberMony(teamMember);

  }


  async update(_id: string, updateTaskDto: UpdateTaskDto)
  {
    // await this.findOne(_id);
    return await this.TaskRepository.updateOne({ _id }, updateTaskDto as any);
  }

  async deleteTask(id: string)
  {
    return await this.TaskRepository.deleteOne({ _id: id });
  }

  async getWeek(date: Date, @AuthUser() me: UserDocument)
  {
    return await this.TaskRepository.getWeek(date, me);
  }
}

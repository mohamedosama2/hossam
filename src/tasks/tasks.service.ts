import
{
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryOptions } from 'mongoose';
import { AuthUser } from 'src/auth/decorators/me.decorator';
import { GroupService } from 'src/group/group.service';
import { NotificationService } from 'src/notification/notification.service';
import { PaymentType } from 'src/payment/models/payment.model';
import { PaymentService } from 'src/payment/payment.service';
import { StudentDocument } from 'src/users/models/student.model';
import { UserDocument } from 'src/users/models/_user.model';
import { UserRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { CreatePaymentTaskDto, CreateTaskDto } from './dto/create-task.dto';
import { FilterQueryOptionsTasks } from './dto/filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { State } from './models/task.model';
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
    private readonly groupService: GroupService,
  ) { }
  async create(createTaskDto: CreateTaskDto)
  {
    const payment = createTaskDto.payment as CreatePaymentTaskDto[];
    let task = await this.TaskRepository.create(createTaskDto);
    let group = await this.groupService.findOne(task.group);
    if (createTaskDto.totalPrice < createTaskDto.totalPriceTeamMember) throw new BadRequestException('totla team member  greater than total price');
    if (payment)
    {
      // console.log('created controller');
      // console.log(createTaskDto.totalPrice);
      // console.log(group.students.length);
      // console.log(createTaskDto.totalPrice / group.students.length);
      for (let i = 0; i < createTaskDto.payment.length; i++)
      {
        let payment = createTaskDto.payment[i];

        if (payment.paid > createTaskDto.totalPrice / group.students.length)
        {
          throw new BadRequestException('paid greater than total price');
        }
        await this.PaymentService.create({
          ...payment,
          task: task._id,
          paymentType: PaymentType.REVENUSE,
          teamMember: createTaskDto.taskManager as any,
          isDeletedPayment: false,
        });
      }
    }
    if (createTaskDto.group)
    {
      const taskGroup = await this.TaskRepository.findPopulatedTask(task._id);
      // console.log(group.students);
      const tokens = [];
      (group.students as any[]).forEach(({ student }) =>
      {
        console.log('St', student);
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
  async createAdmin(createTaskDto: CreateTaskDto)
  {
    // const payment = createTaskDto.payment as CreatePaymentTaskDto;
    let task = await this.TaskRepository.create(createTaskDto);
    if (createTaskDto.taskManager)
    {
      const admin = await this.usersService.findOne(createTaskDto.taskManager);
      console.log('inside notification', admin);
      const tokens = [];

      console.log('St', admin);
      admin.pushTokens.forEach(({ deviceToken }) =>
      {
        /*  console.log('St2', deviceToken); */
        tokens.push({
          deviceToken: deviceToken ? deviceToken : 'testing',
          _id: admin._id,
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

  async findAll(
    FilterQueryOptionsTasks: FilterQueryOptionsTasks,
    @AuthUser() me: UserDocument,
  )
  {
    return await this.TaskRepository.findAllWithPaginationCustome(
      me,
      FilterQueryOptionsTasks,
      // ['university', 'subject', 'state', 'teamMember', 'nameAr', 'nameEn'],
      // { populate: ['group', 'university'] },
    );
  }

  async findOne(_id: string, options?: QueryOptions)
  {
    const isExisted = await this.TaskRepository.findOne({ _id }, options);
    if (!isExisted) throw new NotFoundException();
    return isExisted;
  }

  async teamMemberMony(teamMember: string)
  {
    console.log('here');
    return await this.TaskRepository.allTeamMemberMony(teamMember);
  }

  async update(_id: string, updateTaskDto: UpdateTaskDto)
  {
    // await this.findOne(_id)\
    console.log('created controller')
    console.log(updateTaskDto.taskManager)
    if (updateTaskDto.taskManager)
    {

      let manager = await this.usersService.findOne({
        _id: updateTaskDto.taskManager.id,
      });
      if (!manager) throw new NotFoundException('user not found');
      updateTaskDto.taskManager.id = manager._id;
      updateTaskDto.taskManager.name = manager.username;;
    }
    console.log('created controller2')

    return await this.TaskRepository.updateOne({ _id }, updateTaskDto as any);
  }


  async deleteTask(id: string)
  {

    let task = await this.findOne(id)
    // delete only payment of current or future tasks 
    if (task.state !== State.COMPLETED)
    {
      let taskPayment = await this.PaymentService.findAndUpdateMany(id);
    }
    return await this.TaskRepository.updateOne(
      { _id: id },
      { isDeletedTask: true },
    );
  }

  async getWeek(date: Date, @AuthUser() me: UserDocument)
  {
    return await this.TaskRepository.getWeek(date, me);
  }
}

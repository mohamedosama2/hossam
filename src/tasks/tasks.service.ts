import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { PaymentType } from 'src/payment/models/payment.model';
import { PaymentService } from 'src/payment/payment.service';
import { StudentDocument } from 'src/users/models/student.model';
import { CreatePaymentTaskDto, CreateTaskDto } from './dto/create-task.dto';
import { FilterQueryOptionsTasks, FilterQueryTasks } from './dto/filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    private readonly TaskRepository: TaskRepository,
    private readonly PaymentService: PaymentService,
    private readonly NotificationService: NotificationService,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    const payment = createTaskDto.payment as CreatePaymentTaskDto;
    delete createTaskDto.payment;
    let task = await this.TaskRepository.create(createTaskDto);
    if (payment) {
      await this.PaymentService.create({
        ...payment,
        task: task._id,
<<<<<<< HEAD
        paymentType: PaymentType.REVENUSE
=======
        pymentType: PaymentType.REVENUSE,
>>>>>>> b179a7c55382824fd100ba96726317a56e00e7c5
      });
    }
    const taskGroup = await this.TaskRepository.findPopulatedTask(task._id);
    const tokens = [];
    ((taskGroup.group as any).students as any[]).forEach(({ student }) => {
   /*    console.log('St', student); */
      student.pushTokens.forEach(({ deviceToken }) => {
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

  async findAll(FilterQueryOptionsTasks: FilterQueryOptionsTasks) {
    return await this.TaskRepository.findAllWithPaginationOption(
      FilterQueryOptionsTasks,
      ['university', 'subject', 'status'],
      { populate: ['group', 'university'] },
    );
  }

  async findOne(_id: string) {
    const isExisted = await this.TaskRepository.findOne({ _id });
    if (!isExisted) throw new NotFoundException();
    return isExisted;
  }

  async update(_id: string, updateTaskDto: UpdateTaskDto) {
    // await this.findOne(_id);
    return await this.TaskRepository.updateOne({ _id }, updateTaskDto);
  }

  async deleteTask(id: string) {
    return await this.TaskRepository.deleteOne({ _id: id });
  }
}

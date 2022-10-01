import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { AggregationOpptionsDto } from 'src/utils/pagination/paginationParams.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRepository } from './payment.repository';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { PaymentType } from './models/payment.model';
import { TasksService } from 'src/tasks/tasks.service';
import { FilterQueryOptionsPayment } from './dto/filter.dto';
import { UserDocument } from 'src/users/models/_user.model';
import { AuthUser } from 'src/auth/decorators/me.decorator';

@Injectable()
export class PaymentService
{
  constructor(
    @Inject(forwardRef(() => TasksService))
    private readonly tasksService: TasksService,

    private readonly PaymentRepository: PaymentRepository,
  ) { }
  async create(createPaymentDto: CreatePaymentDto)
  {
    let task = await this.tasksService.findOne(createPaymentDto.task)
    createPaymentDto.teamMember = task.taskManager.id
    return await this.PaymentRepository.create(createPaymentDto);
  }

  async findAll(FilterQueryOptionsTasks: FilterQueryOptionsPayment,
    @AuthUser() me: UserDocument
  )
  {


    return await this.PaymentRepository.findAllWithPaginationCustome(
      me,
      FilterQueryOptionsTasks,
      // ['university', 'subject', 'state', 'teamMember', 'nameAr', 'nameEn'],
      // { populate: ['group', 'university'] },
    );
  }

  async teamMemberMony(teamMember: string)
  {
    console.log('here')
    let totalPrice = await this.tasksService.teamMemberMony(teamMember);

    let paidPrice = await this.PaymentRepository.allTeamMemberMony(teamMember)
    let remaning = (totalPrice.totalmony - paidPrice.totalExpensis)
    return {
      totalPrice: totalPrice.totalmony,
      paidPrice: paidPrice.totalExpensis,
      remaning

    }

  }




  async findTaskDetails(taskId: string)
  {
    return await this.PaymentRepository.findTaskDetails(taskId);
  }


  async findAndUpdateMany(taskId: string)
  {
    return await this.PaymentRepository.updateManyPayment(taskId);
  }


  async findTaskDetailsTeam(taskId: string)
  {
    return await this.PaymentRepository.findTaskDetailsTeam(taskId);
  }


  findOne(id: number)
  {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto)
  {
    return `This action updates a #${id} payment`;
  }

  remove(id: number)
  {
    return `This action removes a #${id} payment`;
  }
}
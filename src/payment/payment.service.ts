import {
  Injectable,
  forwardRef,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { AggregationOpptionsDto } from 'src/utils/pagination/paginationParams.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRepository } from './payment.repository';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { PaymentDocument, PaymentType } from './models/payment.model';
import { TasksService } from 'src/tasks/tasks.service';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(forwardRef(() => TasksService))
    private readonly tasksService: TasksService,

    private readonly PaymentRepository: PaymentRepository,
  ) {}
  async create(createPaymentDto: CreatePaymentDto) {
    let task = await this.tasksService.findOne(createPaymentDto.task, {
      populate: 'group',
    });

    console.log(task.totalPrice);
    let studentsLength = task.group['students'].length
      ? task.group['students'].length
      : 1;
    const taskIndividualPay = task.totalPrice / studentsLength;
    const remaining = await this.PaymentRepository.taskIndividualRemaining(
      createPaymentDto.byWhom,
      task._id,
    );
    createPaymentDto.teamMember = task.taskManager.id;
    if (remaining.length == 0) {
      if (createPaymentDto.paid > taskIndividualPay) {
        throw new BadRequestException(
          ` want to pay ${createPaymentDto.paid} and you must pay just ${taskIndividualPay} `,
        );
      }
      return await this.PaymentRepository.create(createPaymentDto);
    }
    if (remaining[0].allPaid + createPaymentDto.paid > taskIndividualPay) {
      throw new BadRequestException(
        `You cant pay this as you paid ${remaining[0].allPaid} , want to pay ${createPaymentDto.paid} and you must pay just ${taskIndividualPay} `,
      );
    }

    return await this.PaymentRepository.create(createPaymentDto);
  }

  /*  @IsString()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsString()
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsMongoId()
  byWhom: string;

  @IsOptional()
  @ApiHideProperty()
  @IsMongoId()
  teamMember: string;

  @IsMongoId()
  task: string;

  @IsNumber()
  paid: number;

  @IsDate()
  recieveTime: Date; */

  /*   async createManyWithoutTaskId(PaymentDocument: PaymentDocument[]) {
    PaymentDocument.map((payment) => {
      payment.teamMember = task.taskManager.id;
    });
    return await this.PaymentRepository.create(createPaymentDto);
  }
 */
  async findAll(
    taskId: string,
    paymentType: PaymentType,
    AggregationOpptionsDto: AggregationOpptionsDto,
  ) {
    let qury = {
      ...(paymentType && { paymentType: paymentType }),
      task: new Types.ObjectId(taskId),
    };
    return await this.PaymentRepository.findAllWithPaginationAggregationOption(
      AggregationOpptionsDto,

      [{ $match: qury }],
    );
  }

  async teamMemberMony(teamMember: string) {
    console.log('here');
    let totalPrice = await this.tasksService.teamMemberMony(teamMember);

    let paidPrice = await this.PaymentRepository.allTeamMemberMony(teamMember);
    let remaning = totalPrice.totalmony - paidPrice.totalExpensis;
    return {
      totalPrice: totalPrice.totalmony,
      paidPrice: paidPrice.totalExpensis,
      remaning,
    };
  }

  async findTaskDetails(taskId: string) {
    return await this.PaymentRepository.findTaskDetails(taskId);
  }

  async findTaskDetailsTeam(taskId: string) {
    return await this.PaymentRepository.findTaskDetailsTeam(taskId);
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }

  async removeAllPayemntForTask(taskId: string) {
    const data = await this.PaymentRepository.deleteAllReturnedData({
      task: taskId,
    });
    const { task, paymentType } = data[0];
    console.log(task, paymentType);

    /////////////////SAVING DATA
  }
}

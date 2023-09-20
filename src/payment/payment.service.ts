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
import { PaymentType } from './models/payment.model';
import { TasksService } from 'src/tasks/tasks.service';
import { FilterQueryOptionsPayment } from './dto/filter.dto';
import { UserDocument } from 'src/users/models/_user.model';
import { AuthUser } from 'src/auth/decorators/me.decorator';
import { GroupRepository } from 'src/group/group.repository';
import { TaskType } from 'src/tasks/models/task.model';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(forwardRef(() => TasksService))
    private readonly tasksService: TasksService,

    private readonly PaymentRepository: PaymentRepository,
    private readonly GroupRepository: GroupRepository,
  ) { }
  /* async create(createPaymentDto: CreatePaymentDto)
  {
    let task = await this.tasksService.findOne(createPaymentDto.task)
    createPaymentDto.teamMember = task.taskManager.id
    return await this.PaymentRepository.create(createPaymentDto);
  } */

  async create(createPaymentDto: CreatePaymentDto) {
    let task = await this.tasksService.findOne(createPaymentDto.task, {
      populate: 'group',
    });
    console.log(task.totalPrice);
    if (task.student) {
      if (task.taskType == TaskType.SINGLE) {

        console.log('inside 2')
        const remaining = await this.PaymentRepository.taskIndividualRemaining(
          createPaymentDto.byWhom,
          task._id,
        );
        if (remaining.length > 0) {

          if (remaining[0].allPaid + createPaymentDto.paid > task.totalPrice) {
            throw new BadRequestException(
              `You cant pay this as you paid ${remaining[0].allPaid} , want to pay ${createPaymentDto.paid} `,
            );
          }
        }
      }

      if (task.taskType == TaskType.PRIVATE) {

        console.log('inside 2')
        const remaining = await this.PaymentRepository.taskIndividualRemaining(
          createPaymentDto.byWhom,
          task._id,
        );
        if (remaining.length > 0) {

          if (remaining[0].allPaid + createPaymentDto.paid > task.totalPrice) {
            throw new BadRequestException(
              `You cant pay this as you paid ${remaining[0].allPaid} , want to pay ${createPaymentDto.paid} `,
            );
          }
        }
      }
    }
    if (task.group) {
      console.log('inside 5555')
      console.log(task.taskType)

      if (task.taskType == TaskType.GRADUATION) {
        let studentsLength = task.group['students'].length
          ? task.group['students'].length
          : 1;
        const taskIndividualPay = task.totalPrice / studentsLength;
        const remaining = await this.PaymentRepository.taskIndividualRemaining(
          createPaymentDto.byWhom,
          task._id,
        );
        createPaymentDto.teamMember = task._id;
        if (remaining.length == 0) {
          //check if this person in this group
          const isExisted = await this.GroupRepository.findOne({
            _id: task.group['_id'],
            'students.student': createPaymentDto.byWhom,
          });
          console.log(isExisted)
          if (!isExisted) throw new BadRequestException("this user cant pay for this")
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
      }

      // if()
    }

    return await this.PaymentRepository.create(createPaymentDto);
  }

  async remaningMony(byWhom: string, task: string) {
    return await this.PaymentRepository.testingRemaning(byWhom, task)
  }

  async createExpensis(createPaymentDto: CreatePaymentDto) {
    let task = await this.tasksService.findOne(createPaymentDto.task, {
      populate: 'group',
    });
    // console.log(task.taskManager.id)
    // console.log(createPaymentDto.byWhom)

    // if (task.taskManager.id != createPaymentDto.byWhom) throw new BadRequestException("this team member not inside this project")

    const remaining = await this.PaymentRepository.testingRemaning(
      createPaymentDto.byWhom,
      task._id,
    );

    if (remaining.length != 0) {
      console.log('remaining[0].allPaid')
      console.log(remaining[0].allPaid)
      console.log(task.totalPrice)
      if (remaining[0].allPaid + createPaymentDto.paid > task.totalPriceTeamMember) {
        throw new BadRequestException(
          `You cant pay this as you paid ${remaining[0].allPaid} , want to pay ${createPaymentDto.paid} `,
        );
      }
    }
    createPaymentDto.teamMember = createPaymentDto.byWhom
    return await this.PaymentRepository.create(createPaymentDto);
  }
  async findAll(
    FilterQueryOptionsTasks: FilterQueryOptionsPayment,
    @AuthUser() me: UserDocument,
  ) {
    return await this.PaymentRepository.findAllWithPaginationCustome(
      me,
      FilterQueryOptionsTasks,
      // ['university', 'subject', 'state', 'teamMember', 'nameAr', 'nameEn'],
      // { populate: ['group', 'university'] },
    );
  }

  async teamMemberMony(teamMember: string) {
    console.log('here');
    let totalPrice = await this.tasksService.teamMemberMony(teamMember);

    let paidPrice = await this.PaymentRepository.allTeamMemberMony(teamMember);

    console.log('totalPrice')
    console.log(totalPrice)
    console.log('paidPrice')
    console.log(paidPrice)
    let totalMony = totalPrice == undefined ? 0 : totalPrice.totalmony
    let totalExpensis = paidPrice == undefined ? 0 : paidPrice.totalExpensis
    let remaning = totalMony - totalExpensis;
    return {
      totalPrice: totalMony,
      paidPrice: totalExpensis,
      remaning,
    };
  }

  async allPaymentMony(paymentType: PaymentType) {
    // let totalPrice = await this.tasksService.teamMemberMony(teamMember);

    let paidPayment = await this.PaymentRepository.allPaymentMony(paymentType);
    return {
      paidPayment
    };
  }

  async findTaskDetails(taskId: string) {
    return await this.PaymentRepository.findTaskDetails(taskId);
  }

  async findAndUpdateMany(taskId: string) {
    return await this.PaymentRepository.updateManyPayment(taskId);
  }

  async findTaskDetailsTeam(taskId: string) {
    return await this.PaymentRepository.findTaskDetailsTeam(taskId);
  }
}
/*   findOne(id: number)
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
  } */

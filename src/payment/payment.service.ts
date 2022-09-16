import { Injectable } from '@nestjs/common';
import { AggregationOpptionsDto } from 'src/utils/pagination/paginationParams.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRepository } from './payment.repository';
import { Types, Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class PaymentService
{
  constructor(private readonly PaymentRepository: PaymentRepository) { }
  async create(createPaymentDto: CreatePaymentDto)
  {
    return await this.PaymentRepository.create(createPaymentDto);
  }

  async findAll(
    taskId: string,
    AggregationOpptionsDto: AggregationOpptionsDto,
  )
  {
    return await this.PaymentRepository.findAllWithPaginationAggregationOption(
      AggregationOpptionsDto,
      [{ $match: { task: new Types.ObjectId(taskId) } }],
    );
  }

  async findTaskDetails(taskId: string)
  {
    return await this.PaymentRepository.findTaskDetails(taskId);
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

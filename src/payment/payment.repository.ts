import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Payment, PaymentDocument } from './models/payment.model';
import { Types, Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class PaymentRepository extends BaseAbstractRepository<Payment> {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {
    super(paymentModel);
  }
  async findTaskDetails(taskId: string) {
    const taskDeatils = await this.paymentModel.aggregate([
      { $match: { task: new Types.ObjectId(taskId) } },

      {
        $facet: {
          taskDetails: [
            { $limit: 1 },
            {
              $lookup: {
                from: 'tasks',
                localField: 'task',
                foreignField: '_id',
                as: 'task',
              },
            },
            { $unwind: { path: '$task', preserveNullAndEmptyArrays: true } },
          ],
          teamMember: [
            { $limit: 1 },
            {
              $lookup: {
                from: 'tasks',
                localField: 'task',
                foreignField: '_id',
                as: 'task',
              },
            },
            { $unwind: { path: '$task', preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: 'users',
                localField: 'task.taskManager',
                foreignField: '_id',
                as: 'taskManager',
              },
            },
            {
              $unwind: {
                path: '$taskManager',
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          subject: [
            { $limit: 1 },
            {
              $lookup: {
                from: 'tasks',
                localField: 'task',
                foreignField: '_id',
                as: 'task',
              },
            },
            { $unwind: { path: '$task', preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: 'subjects',
                localField: 'task.subject',
                foreignField: '_id',
                as: 'subject',
              },
            },
            { $unwind: { path: '$subject', preserveNullAndEmptyArrays: true } },
          ],
          group: [
            { $limit: 1 },
            {
              $lookup: {
                from: 'tasks',
                localField: 'task',
                foreignField: '_id',
                as: 'task',
              },
            },
            { $unwind: { path: '$task', preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: 'groups',
                localField: 'task.group',
                foreignField: '_id',
                as: 'group',
              },
            },
            { $unwind: { path: '$group', preserveNullAndEmptyArrays: true } },
          ],
          paymentDetails: [
            {
              $lookup: {
                from: 'tasks',
                localField: 'task',
                foreignField: '_id',
                as: 'task',
              },
            },
            { $unwind: { path: '$task', preserveNullAndEmptyArrays: true } },
            {
              $group: {
                _id: null,
                paid: { $sum: '$paid' },

                totalPrice: { $first: '$task.totalPrice' },
              },
            },
            {
              $project: {
                remaining: { $subtract: ['$totalPrice', '$paid'] },
                totalPrice: 1,
                paid: 1,
              },
            },
          ],
          allPayments: [
            {
              $lookup: {
                from: 'users',
                localField: 'byWhom',
                foreignField: '_id',
                as: 'byWhom',
              },
            },
            {
              $lookup: {
                from: 'tasks',
                localField: 'task',
                foreignField: '_id',
                as: 'task',
              },
            },
            { $unwind: { path: '$task', preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: 'groups',
                localField: 'task.group',
                foreignField: '_id',
                as: 'group',
              },
            },
            { $unwind: { path: '$group', preserveNullAndEmptyArrays: true } },
            {
              $project: {
                byWhom: 1,
                paid: 1,
                totalPriceToPay: {
                  $divide: ['$task.totalPrice', { $size: '$group.students' }],
                },
                recieveTime: 1,
                raimainigAmount: {
                  $subtract: [
                    {
                      $divide: [
                        '$task.totalPrice',
                        { $size: '$group.students' },
                      ],
                    },
                    '$paid',
                  ],
                },
              },
            },
          ],
        },
      },
    ]);
    return taskDeatils;
  }
}

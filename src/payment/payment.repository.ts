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
  )
  {
    super(paymentModel);
  }
  async findTaskDetails(taskId: string)
  {
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
            {
              $unwind: {
                path: '$task',//+ preserveNullAndEmptyArrays: true
              }
            },
            // {
            //   $project: {
            //     'task.nameEn': 1,
            //     'task.nameAr': 1,
            //     'task.createdAt': 1,
            //     'task.totalPrice': 1,
            //     'task.state ': 1,
            //     'task.endDate': 1,

            //   }
            // }
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
            { $unwind: { path: '$task' } },
            {
              $lookup: {
                from: 'subjects',
                localField: 'task.subject',
                foreignField: '_id',
                as: 'subject',
              },
            },
            { $unwind: { path: '$subject' } },

            {
              $project: {
                'subject.nameEn': 1,
                'subject.nameAr': 1,
                'subject.semester': 1
              }
            }
          ],
          university: [
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
                from: 'universities',
                localField: 'task.university',
                foreignField: '_id',
                as: 'university',
              },
            },
            { $unwind: { path: '$university', preserveNullAndEmptyArrays: true } },

            {
              $project: {
                'university.nameEn': 1,
                'university.nameAr': 1,




              }
            }
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
            { $unwind: { path: '$group.students', preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: 'users',
                localField: 'group.students.student',
                foreignField: '_id',
                as: 'group.students.student',
              },
            },
            { $unwind: { path: '$group.students.student', preserveNullAndEmptyArrays: true } },
            {
              $project: {

                'group.students.student.username': 1,
                'group.students.student.phone': 1,
                'group.students.isTeamLeader': 1,
              }
            }
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
            { $unwind: { path: '$group' } },
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
  async findTaskDetailsTeam(taskId: string)
  {
    const taskDeatils = await this.paymentModel.aggregate([
      { $match: { 'taskManager.id': new Types.ObjectId(taskId) } },

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
            // {
            //   $project: {
            //     'task.nameEn': 1,
            //     'task.nameAr': 1,
            //     'task.createdAt': 1,
            //     'task.totalPrice': 1,
            //     'task.state ': 1,
            //     'task.endDate': 1,

            //   }
            // }
          ],
          // subject: [
          //   { $limit: 1 },
          //   {
          //     $lookup: {
          //       from: 'tasks',
          //       localField: 'task',
          //       foreignField: '_id',
          //       as: 'task',
          //     },
          //   },
          //   { $unwind: { path: '$task', preserveNullAndEmptyArrays: true } },
          //   {
          //     $lookup: {
          //       from: 'subjects',
          //       localField: 'task.subject',
          //       foreignField: '_id',
          //       as: 'subject',
          //     },
          //   },
          //   { $unwind: { path: '$subject', preserveNullAndEmptyArrays: true } },

          //   {
          //     $project: {
          //       'subject.nameEn': 1,
          //       'subject.nameAr': 1,
          //       'subject.semester': 1



          //     }
          //   }
          // ],
          // university: [
          //   { $limit: 1 },
          //   {
          //     $lookup: {
          //       from: 'tasks',
          //       localField: 'task',
          //       foreignField: '_id',
          //       as: 'task',
          //     },
          //   },
          //   { $unwind: { path: '$task', preserveNullAndEmptyArrays: true } },
          //   {
          //     $lookup: {
          //       from: 'universities',
          //       localField: 'task.university',
          //       foreignField: '_id',
          //       as: 'university',
          //     },
          //   },
          //   { $unwind: { path: '$university', preserveNullAndEmptyArrays: true } },

          //   {
          //     $project: {
          //       'university.nameEn': 1,
          //       'university.nameAr': 1,




          //     }
          //   }
          // ],
          // group: [
          //   { $limit: 1 },
          //   {
          //     $lookup: {
          //       from: 'tasks',
          //       localField: 'task',
          //       foreignField: '_id',
          //       as: 'task',
          //     },
          //   },
          //   { $unwind: { path: '$task', preserveNullAndEmptyArrays: true } },
          //   {
          //     $lookup: {
          //       from: 'groups',
          //       localField: 'task.group',
          //       foreignField: '_id',
          //       as: 'group',
          //     },
          //   },
          //   { $unwind: { path: '$group', preserveNullAndEmptyArrays: true } },
          //   { $unwind: { path: '$group.students', preserveNullAndEmptyArrays: true } },
          //   {
          //     $lookup: {
          //       from: 'users',
          //       localField: 'group.students.student',
          //       foreignField: '_id',
          //       as: 'group.students.student',
          //     },
          //   },
          //   { $unwind: { path: '$group.students.student', preserveNullAndEmptyArrays: true } },
          //   {
          //     $project: {

          //       'group.students.student.username': 1,
          //       'group.students.student.phone': 1,
          //       'group.students.isTeamLeader': 1,
          //     }
          //   }
          // ],
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
                _id: { taskDetails: "$task._id" },
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
          // allPayments: [
          //   {
          //     $lookup: {
          //       from: 'users',
          //       localField: 'byWhom',
          //       foreignField: '_id',
          //       as: 'byWhom',
          //     },
          //   },
          //   {
          //     $lookup: {
          //       from: 'tasks',
          //       localField: 'task',
          //       foreignField: '_id',
          //       as: 'task',
          //     },
          //   },
          //   { $unwind: { path: '$task', preserveNullAndEmptyArrays: true } },
          //   {
          //     $lookup: {
          //       from: 'groups',
          //       localField: 'task.group',
          //       foreignField: '_id',
          //       as: 'group',
          //     },
          //   },
          //   { $unwind: { path: '$group', preserveNullAndEmptyArrays: true } },
          //   {
          //     $project: {
          //       byWhom: 1,
          //       paid: 1,
          //       totalPriceToPay: {
          //         $divide: ['$task.totalPrice', { $size: '$group.students' }],
          //       },
          //       recieveTime: 1,
          //       raimainigAmount: {
          //         $subtract: [
          //           {
          //             $divide: [
          //               '$task.totalPrice',
          //               { $size: '$group.students' },
          //             ],
          //           },
          //           '$paid',
          //         ],
          //       },
          //     },
          //   },
          // ],
        },
      },
    ]);
    return taskDeatils;
  }
}

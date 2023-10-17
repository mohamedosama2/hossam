import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PaginateModel, PaginateOptions } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Payment, PaymentDocument, PaymentType } from './models/payment.model';
import { Types, Schema as MongooseSchema } from 'mongoose';
var ObjectId = require('mongodb').ObjectId;
import * as _ from 'lodash';
import * as moment from "moment"
import { AuthUser } from 'src/auth/decorators/me.decorator';
import { UserDocument, UserRole } from 'src/users/models/_user.model';

@Injectable()
export class PaymentRepository extends BaseAbstractRepository<Payment> {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {
    super(paymentModel);
  }


  async findTaskPayments(taskId: string) {
    const taskDeatils = await this.paymentModel.aggregate([
      { $match: { task: new Types.ObjectId(taskId) } }])

    return taskDeatils
  }

  async updateManyPayment(_id: string) {
    // const taskDeatils = await this.paymentModel.aggregate([
    //   { $match: { task: new Types.ObjectId(_id) } }])

    await this.paymentModel.updateMany(
      { task: _id },
      {
        isDeletedPayment: true
      },
    );
  }

  async findTaskDetails(taskId: string) {
    const taskDeatils = await this.paymentModel.aggregate([
      { $match: { task: ObjectId(taskId),/* paymentType: PaymentType.REVENUSE*/ } },

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
                path: '$task', preserveNullAndEmptyArrays: true
              },
            },
            {
              $lookup: {
                from: 'collages',
                localField: 'task.collage',
                foreignField: '_id',
                as: 'collage',
              },
            },
            { $unwind: { path: '$collage', preserveNullAndEmptyArrays: true } },
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
                'subject.semester': 1,
              },
            },
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
            {
              $unwind: {
                path: '$university',
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $project: {
                'university.nameEn': 1,
                'university.nameAr': 1,
              },
            },
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
            {
              $unwind: {
                path: '$group.students',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'group.students.student',
                foreignField: '_id',
                as: 'group.students.student',
              },
            },
            {
              $unwind: {
                path: '$group.students.student',
                preserveNullAndEmptyArrays: true,
              },
            },
            // {
            //   $project: {
            //     'group.students.student.username': 1,
            //     'group.students.student.phone': 1,
            //     'group.students.isTeamLeader': 1,
            //   },
            // },
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
            { $unwind: { path: '$byWhom', preserveNullAndEmptyArrays: true } },
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
                as: 'task.group',
              },
            },

            {
              $group: {
                _id: "$byWhom._id",
                payments: { $push: '$$ROOT' },
                // totalPrice: { $push: '$task.totalPrice' },
              },
            },
            /* { $unwind: { path: '$task.group',preserveNullAndEmptyArrays: true  } }, */
            /* {
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
            }, */
          ],
        },
      },
    ]);
    return taskDeatils;
  }
  async findTaskDetailsTeam(taskId: string) {
    const taskDeatils = await this.paymentModel.aggregate([
      {
        $match: {
          teamMember: ObjectId(taskId),
          paymentType: PaymentType.REVENUSE,
        },
      },

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
    console.log();
    return taskDeatils;
  }
  public async allTeamMemberMony(tramMember: string) {
    let stages = [
      {
        $match: {
          teamMember: ObjectId(tramMember),
          paymentType: PaymentType.EXPENSIS,
        },
      },
      {
        $group: {
          _id: null,
          totalExpensis: { $sum: '$paid' },
        },
      },
    ];
    console.log(stages);
    let mony = await this.paymentModel.aggregate(stages);
    return mony[0];
  }



  public async allPaymentMony(paymentType: PaymentType) {
    let stages = [
      {
        $match: {
          paymentType: paymentType,
        },
      },
      {
        $group: {
          _id: null,
          totalExpensis: { $sum: '$paid' },
        },
      },
    ];
    console.log(stages);
    let mony = await this.paymentModel.aggregate(stages);
    return mony[0];
  }


  public async findAllWithPaginationCustome(
    @AuthUser() me: UserDocument,
    queryFiltersAndOptions: any,
  ): Promise<PaymentDocument[]> {
    console.log(queryFiltersAndOptions)

    let filters: FilterQuery<PaymentDocument> = _.pick(queryFiltersAndOptions, [
      'task',
      'teamMember',
      'from',
      'to',
      'title',
      'paymentType',
      'isDeletedPayment'
    ]);
    console.log('here')
    const options: PaginateOptions = _.pick(queryFiltersAndOptions, [
      'page',
      'limit',
    ]);
    let query = {
      ...(queryFiltersAndOptions.isDeletedPayment !== null &&
        // queryFiltersAndOptions.isDeletedPayment !== undefined &&
        { isDeletedPayment: queryFiltersAndOptions.isDeletedPayment == 'true' as any ? { $ne: false } : { $ne: true } }),

      // ...(queryFiltersAndOptions.isDeletedPayment &&
      //   { isDeletedPayment: queryFiltersAndOptions.isDeletedPayment }),


      ...((queryFiltersAndOptions.from || queryFiltersAndOptions.to) && {
        createdAt: {
          ...(queryFiltersAndOptions.from && { $gte: moment(queryFiltersAndOptions.from).utc().startOf('d').toDate(), }),
          ...(queryFiltersAndOptions.to && { $lte: moment(queryFiltersAndOptions.to).utc().endOf('d').toDate(), })
        }
      }),
      ...(queryFiltersAndOptions.task && { task: ObjectId(queryFiltersAndOptions.task) }),
      ...(queryFiltersAndOptions.teamMember && { teamMember: ObjectId(queryFiltersAndOptions.teamMember) }),
      ...(queryFiltersAndOptions.title && { title: new RegExp(_.escapeRegExp(queryFiltersAndOptions.title), 'i') }),
      ...(queryFiltersAndOptions.paymentType && { paymentType: queryFiltersAndOptions.paymentType }),
    }
    delete filters.task
    delete filters.paymentType
    delete filters.isDeletedPayment
    delete filters.from
    delete filters.to


    let docs;
    console.log(filters)
    console.log(query)
    if (queryFiltersAndOptions.allowPagination) {
      docs = await (this.paymentModel as PaginateModel<PaymentDocument>).paginate(
        // here we can but any option to to query like sort
        {
          filters,
          ...query
        },
        {
          ...options,
          populate: ['byWhom', 'task', 'teamMember']
        }
      );
    } else {
      docs = await this.paymentModel.find({
        filters,
        ...query
      },)
        .populate(['byWhom', 'task', 'teamMember'])
    }
    return docs;
  }

  public async findAllNew(@AuthUser() me: UserDocument,
    queryFiltersAndOptions: any,
  ): Promise<PaymentDocument[]> {

    const skip = queryFiltersAndOptions.limit * (queryFiltersAndOptions.page - 1);


    const allowLimit = {
      ...(queryFiltersAndOptions.allowPagination && { $limit: queryFiltersAndOptions.limit }),
    };



    const allowSkip = {
      ...(queryFiltersAndOptions.allowPagination && { $skip: skip }),
    };
    let query = {
      ...(queryFiltersAndOptions.isDeletedPayment !== null &&
        // queryFiltersAndOptions.isDeletedPayment !== undefined &&
        { isDeletedPayment: queryFiltersAndOptions.isDeletedPayment == 'true' as any ? { $ne: false } : { $ne: true } }),

      // ...(queryFiltersAndOptions.isDeletedPayment &&
      //   { isDeletedPayment: queryFiltersAndOptions.isDeletedPayment }),


      ...((queryFiltersAndOptions.from || queryFiltersAndOptions.to) && {
        createdAt: {
          ...(queryFiltersAndOptions.from && { $gte: moment(queryFiltersAndOptions.from).utc().startOf('d').toDate(), }),
          ...(queryFiltersAndOptions.to && { $lte: moment(queryFiltersAndOptions.to).utc().endOf('d').toDate(), })
        }
      }),
      ...(queryFiltersAndOptions.task && { task: ObjectId(queryFiltersAndOptions.task) }),
      ...(queryFiltersAndOptions.teamMember && { teamMember: ObjectId(queryFiltersAndOptions.teamMember) }),
      ...(queryFiltersAndOptions.title && { title: new RegExp(_.escapeRegExp(queryFiltersAndOptions.title), 'i') }),
      ...(queryFiltersAndOptions.paymentType && { paymentType: queryFiltersAndOptions.paymentType }),
    }

    let docs = await this.paymentModel.aggregate([
      {
        $match: query
      },
      {
        $sort: { _id: -1 }
      },
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
          path: '$task',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: 'teamMember',
          foreignField: '_id',
          as: 'teamMember',
        },
      },
      {
        $unwind: {
          path: '$teamMember',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: 'byWhom',
          foreignField: '_id',
          as: 'byWhom',
        },
      },
      {
        $unwind: {
          path: '$byWhom',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $group: {
          _id: '$byWhom._id',
          payments: { $push: '$$ROOT' },
          // rewardStreams: { $first: '$rewardStreams' },
          // priceInfo: { $first: '$priceInfo' },
          // productType: { $first: '$productType' },
          // priceList: { $first: '$priceList' },
          // vertical: { $first: '$vertical' },
          // userType: { $first: '$userType' },
          // baseInsentive: { $first: '$baseInsentive' },
        },
      },

      {
        $facet: {
          totalDocs: [{ $count: 'count' }],
          docs: queryFiltersAndOptions.allowPagination == true ? [allowSkip, allowLimit] : [],
        },
      },
      {
        $project: {
          totalDocs: { $first: '$totalDocs.count' },
          docs: 1,
        },
      },
      {
        $addFields: {
          paginationMeta: {
            _id: '$$REMOVE',
            page: queryFiltersAndOptions.allowPagination == false ? null : queryFiltersAndOptions.page,
            limit: queryFiltersAndOptions.allowPagination == false ? null : queryFiltersAndOptions.limit,
            skip: queryFiltersAndOptions.allowPagination == false ? null : skip,
            totalDocs: '$totalDocs',
            totalPages: {
              $ceil: {
                $divide: ['$totalDocs', queryFiltersAndOptions.allowPagination == false ? null : queryFiltersAndOptions.limit],
              },
            },
          },
        },
      },
      {
        $project: {
          totalDocs: 0,
        },
      },
    ])

    return docs[0]
  }

  async taskIndividualRemaining(byWhom: string, taskId: string) {
    console.log('byWhom, taskId');
    console.log(byWhom, taskId);
    const remaining = await this.paymentModel.aggregate([
      {
        $match: {
          byWhom: ObjectId(byWhom),
          task: ObjectId(taskId),
        },
      },
      { $group: { _id: null, allPaid: { $sum: '$paid' } } },
      // {
      //   $project:
      //   {
      //     _id: 1,
      //     allPaid: 1
      //     // { $ifNull: ['$allPaid', 0] }
      //     // { $sum: '$paid' }
      //   }
      // },
    ]);

    console.log('REMAINING', remaining);
    return remaining;
  }

  async testingRemaning(byWhom: string, taskId: string) {
    console.log(byWhom, taskId);
    const remaining = await this.paymentModel.aggregate([
      {
        $match: {
          teamMember: new Types.ObjectId(byWhom),
          task: new Types.ObjectId(taskId),
          paymentType: PaymentType.EXPENSIS,

        },
      },
      { $group: { _id: null, allPaid: { $sum: '$paid' } } },
    ]);

    console.log('REMAINING', remaining);
    return remaining;
  }





}

import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './models/payment.model';
import { PaymentRepository } from './payment.repository';
import { TasksModule } from 'src/tasks/tasks.module';
import { GroupModule } from 'src/group/group.module';
import { UsersModule } from 'src/users/users.module';

@Module({

  imports: [
    MongooseModule.forFeature([
      {
        name: Payment.name,
        schema: PaymentSchema,
      },
    ]),
    forwardRef(() => TasksModule),
    GroupModule,
    UsersModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
  exports: [PaymentService, PaymentRepository]
})
export class PaymentModule { }

import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './models/task.model';
import { TaskRepository } from './task.repository';
import { PaymentModule } from 'src/payment/payment.module';
import { NotificationModule } from 'src/notification/notification.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TaskRepository],
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
    ]),
    PaymentModule,
    NotificationModule,
    UsersModule,
  ],
  exports: [TasksService, TaskRepository],
})
export class TasksModule { }

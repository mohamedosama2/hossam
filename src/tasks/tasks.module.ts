import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './models/task.model';
import { TaskRepository } from './task.repository';
import { PaymentModule } from 'src/payment/payment.module';

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
  ],
})
export class TasksModule {}

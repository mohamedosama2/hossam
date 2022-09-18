import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { Task } from 'src/tasks/models/task.model';
import { User } from 'src/users/models/_user.model';

export enum PaymentMethod
{
  VISA = 'VISA',
  CASH = 'CASH',
}

export enum PaymentType
{
  EXPENSIS = 'EXPENSIS',
  REVENUSE = 'REVENUSE',
}
export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment
{
  id?: string;

  @Prop({ type: String, enum: Object.values(PaymentMethod), required: true })
  method: PaymentMethod;

  @Prop({ type: String, enum: Object.values(PaymentType), required: true })
  paymentType: PaymentType;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  byWhom: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Task.name,
    required: true,
  })
  task: string;

  @Prop({ type: Number, required: true })
  paid: number;

  @Prop({ type: Date, required: true })
  recieveTime: Date;
}

const PaymentSchema = SchemaFactory.createForClass(Payment);

export { PaymentSchema };

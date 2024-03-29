import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema, Document } from 'mongoose';
import { Group } from 'src/group/models/group.model';
import { Subject } from 'src/subjects/models/subject.model';
import { University } from 'src/university/models/university.model';
import { User } from 'src/users/models/_user.model';

export type TaskDocument = Task & Document;

export enum State
{
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}
export class Manager
{
  @Prop({ type: String, required: true })
  id?: string;

  @Prop()
  name?: string;
}

@Schema({ timestamps: true })
export class Task
{
  id?: string;

  @Prop({
    type: String,
    // required: true
  })
  nameAr?: string;

  @Prop({ type: String, required: true })
  nameEn?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: University.name,
    // required: true,
  })
  university?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Subject.name,
    // required: true,
  })
  subject?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Group.name,
    // required: true,
  })
  group?: string;

  @Prop({ type: () => Manager })
  taskManager?: Manager;

  @Prop({ type: Number })
  totalPrice?: number;

  @Prop({ type: Number, default: 0 })
  totalPriceTeamMember?: number;

  @Prop({ type: String, enum: Object.values(State) })
  state?: State;

  @Prop({ type: Date, required: true })
  startDate?: Date;

  @Prop({ type: Date })
  deuDate?: Date;

  @Prop({ type: Date, required: true })
  endDate?: Date;

  @Prop({ type: Boolean })
  isAdminTask?: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  isDeletedTask?: boolean;
}

const TaskSchema = SchemaFactory.createForClass(Task);

export { TaskSchema };

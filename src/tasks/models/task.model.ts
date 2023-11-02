import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema, Document } from 'mongoose';
import { Collage } from 'src/collage/entities/collage.entity';
import { Group } from 'src/group/models/group.model';
import { PaymentMethod } from 'src/payment/models/payment.model';
import { Subject } from 'src/subjects/models/subject.model';
import { University } from 'src/university/models/university.model';
import { User } from 'src/users/models/_user.model';

export type TaskDocument = Task & Document;

export enum State {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export enum Methods {
  VISA = 'VISA',
  CASH = 'CASH',
}

export enum TaskType {
  GRADUATION = 'GRADUATION',
  SINGLE = 'SINGLE',
  PRIVATE = 'PRIVATE',
}

export enum TasksLevel {
  PORPOSAL = 'PORPOSAL',
  MIDTERM = 'MIDTERM',
  FINAL = 'FINAL',
  GRADE = 'GRADE',
  //test
}

export enum LevelType {
  REPORT = 'REPORT',
  MIDTERM = 'MIDTERM',
  PORPOSAL = 'PORPOSAL',
  PERSENTATION = 'PERSENTATION',
  DEMO = 'DEMO',
  TOTAL = 'TOTAL',
}

export enum WeekDay {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}
export enum Semester {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
}

export enum ATTENDENCEPALCE {
  ONSITE = 'ONSITE',
  REMOTE = 'REMOTE',
}
export enum LessonFor {
  STUDENT = 'STUDENT',
  GROUP = 'GROUP',
}
export enum TaskFor {
  UNIVERSITY = 'UNIVERSITY',
  COMPANY = 'COMPANY',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}
export class Manager {
  @Prop({ type: String, required: false })
  id?: string;

  @Prop()
  name?: string;
}
export class Level {
  @Prop({ type: String, enum: Object.values(LevelType), required: false })
  levelType?: LevelType;

  @Prop({ type: String, enum: Object.values(State), required: false })
  levelStatus?: State;

  @Prop()
  name?: string;

  @Prop({ type: Number, required: false })
  degree?: number;

  @Prop({ type: Date, required: false })
  deuDate?: Date;
}

export class TaskDay {
  @Prop({ type: String, enum: Object.values(LevelType), required: false })
  day?: LevelType;

  @Prop({ type: Date, required: false })
  start?: Date;

  @Prop({ type: Date, required: false })
  end?: Date;
}




export class TaskLevels {


  @Prop({ type: String, enum: Object.values(TasksLevel), required: false })
  taskLevel?: TasksLevel;

  @Prop({ type: () => Level, required: false })
  taskLevelData?: Level[];
}

@Schema({ timestamps: true })
export class Task {
  id?: string;

  @Prop({
    type: String,
    // required: false
    required: false
  })
  nameAr?: string;

  @Prop({ type: String, required: false })
  nameEn?: string;

  @Prop({ type: String, required: false })
  lecture?: string;

  @Prop({ type: String, required: false })
  companyName?: string;

  @Prop({ type: String, required: false })
  note?: string;

  @Prop({ type: String, required: false })
  logo?: string;

  @Prop({ type: String, required: false })
  projectIdiea?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: University.name,
    required: false,
  })
  university?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Collage.name,
    required: false,
  })
  collage?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Subject.name,
    required: false,
  })
  subject?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Group.name,
    required: false,
  })
  group?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: false,
  })
  student?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: false,
  })
  programmer?: string;
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: false,
  })
  reporter?: string;

  @Prop({ type: () => Manager, required: false })
  taskManager?: Manager;

  @Prop({ type: Number, required: false })
  totalPrice?: number;

  @Prop({ type: Number, required: false })
  hourPrice?: number;

  @Prop({ type: Number, required: false })
  numberOfHours?: number;

  @Prop({ type: Number, default: 0, required: false })
  totalPriceTeamMember?: number;

  @Prop({ type: Number, default: 0, required: false })
  totalPriceProgrammer?: number;

  @Prop({ type: Number, default: 0, required: false })
  totalPriceReporter?: number;

  @Prop({ type: String, enum: Object.values(State), required: false })
  state?: State;

  @Prop({ type: String, required: false, enum: Object.values(Methods) })
  methods: Methods;

  @Prop({ type: String, enum: Object.values(State), required: false })
  attendPlace?: State;

  @Prop({ type: String, enum: Object.values(TaskType), required: false })
  taskType?: TaskType;

  // single task
  @Prop({ type: String, required: false, enum: Object.values(Semester) })
  semester: Semester;

  @Prop({ type: String, required: false, })
  paymentMethod?: PaymentMethod | any;

  @Prop({ type: String, required: false, })
  paymentStatus?: PaymentStatus | any;
  // private task

  @Prop({ type: String, required: false, enum: Object.values(ATTENDENCEPALCE) })
  attendancePlace: ATTENDENCEPALCE;

  @Prop({ type: String, required: false, enum: Object.values(LessonFor) })
  lessonFor: LessonFor;

  @Prop({ type: String, required: false, enum: Object.values(TaskFor) })
  taskFor?: TaskFor;

  @Prop({ type: Number, required: false })
  pricePerHour?: number;

  @Prop({ type: () => TaskLevels, required: false })
  levels?: TaskLevels[];

  @Prop({ type: () => TaskDay, required: false })
  days?: TaskDay[];

  @Prop({ type: Date, required: false })
  startDate?: Date;

  @Prop({ type: String, required: false })
  year?: string;

  @Prop({ type: String, required: false })
  grade?: string;

  @Prop({ type: Number, required: false })
  totalDegree?: number;

  // ================== here question single task 
  @Prop({ type: Date, required: false })
  studyYear?: Date;

  @Prop({ type: Date, required: false })
  deuDate?: Date;

  @Prop({ type: Date, required: false })
  endDate?: Date;

  @Prop({ type: Boolean, required: false })
  isAdminTask?: boolean;

  @Prop({
    type: Boolean,
    default: false, required: false
  }) //testing
  isDeletedTask?: boolean;

  @Prop(
    raw([
      {

        type: MongooseSchema.Types.ObjectId,
        ref: User.name, ///EDDITON
        required: true,


      },
    ]),
  )
  taskStudents: Record<string, any>[];
}

const TaskSchema = SchemaFactory.createForClass(Task);

export { TaskSchema };

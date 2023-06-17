import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema, Document } from 'mongoose';
import { Group } from 'src/group/models/group.model';
import { Subject } from 'src/subjects/models/subject.model';
import { University } from 'src/university/models/university.model';
import { User } from 'src/users/models/_user.model';

export type TaskDocument = Task & Document;

export enum State {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
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

export enum Semester {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
}

export enum ATTENDENCEPALCE {
  ONSITE = 'ONSITE',
  REMOTE = 'REMOTE',
}
export class Manager {
  @Prop({ type: String, required: true })
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
    // required: true
  })
  nameAr?: string;

  @Prop({ type: String, required: true })
  nameEn?: string;

  @Prop({ type: String, required: true })
  logo?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: University.name,
    // required: true,
  })
  university?: string;

  // @Prop({
  //   type: MongooseSchema.Types.ObjectId,
  //   // ref: Collage.name,
  //   // required: true,
  // })
  // collage?: string;

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
    // required: true,
  })
  reporter?: string;

  @Prop({ type: () => Manager })
  taskManager?: Manager;

  @Prop({ type: Number })
  totalPrice?: number;

  @Prop({ type: Number, default: 0 })
  totalPriceTeamMember?: number;

  @Prop({ type: String, enum: Object.values(State) })
  state?: State;

  @Prop({ type: String, enum: Object.values(State) })
  taskType?: State;

  // single task
  @Prop({ type: String, required: true, enum: Object.values(Semester) })
  semester: Semester;

  // private task

  @Prop({ type: String, required: true, enum: Object.values(ATTENDENCEPALCE) })
  attendancePlace: ATTENDENCEPALCE;


  @Prop({ type: Number, required: true })
  numberOfHours?: number;


  @Prop({ type: Number, required: true })
  pricePerHour?: number;


  @Prop({ type: () => TaskLevels })
  levels?: TaskLevels[];


  @Prop({ type: Date, required: true })
  startDate?: Date;

  // ================== here question single task 
  @Prop({ type: Date, required: true })
  studyYear?: Date;

  @Prop({ type: Date, required: false })
  deuDate?: Date;

  @Prop({ type: Date, required: true })
  endDate?: Date;

  @Prop({ type: Boolean })
  isAdminTask?: boolean;

  @Prop({
    type: Boolean,
    default: false,
  }) //testing
  isDeletedTask?: boolean;
}

const TaskSchema = SchemaFactory.createForClass(Task);

export { TaskSchema };

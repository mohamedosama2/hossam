import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { University } from 'src/university/models/university.model';
import { Document } from 'mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

export type SubjectDocument = Subject & Document;

export enum Semester {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
}

@Schema()
export class Subject {
  id?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: University.name,
    required: true,
  })
  university: string;

  @Prop({ type: String, required: true, enum: Object.values(Semester) })
  semester: Semester;

  @Prop({ type: String, required: true })
  nameAr: string;

  @Prop({ type: String, required: true })
  nameEn: string;

  @Prop({ type: String, required: true })
  doctorNameAr: string;

  @Prop({ type: String, required: true })
  doctorNameEn: string;

  @Prop({ type: String, required: true })
  driveLink: string;
  
  @Prop({ type: String, required: true })
  driveMaterials: string;
}

const SubjectSchema = SchemaFactory.createForClass(Subject);

export { SubjectSchema };

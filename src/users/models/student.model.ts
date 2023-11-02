import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User, UserRole } from './_user.model';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { University } from 'src/university/models/university.model';
import { Collage } from 'src/collage/entities/collage.entity';

export type StudentDocument = Student & Document;

@Schema()
export class Student {
  role: UserRole;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: University.name,
    required: true,
  })
  university: string;
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Collage.name,
    required: true,
  })
  collage: string;

  @Prop({ type: Number })
  identificationNumber?: number;


  @Prop({ type: Date, required: false })
  enrolmentDate?: Date;

}

const StudentSchema = SchemaFactory.createForClass(Student);

export { StudentSchema };

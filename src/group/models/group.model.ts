import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { University } from 'src/university/models/university.model';
import { Student } from 'src/users/models/student.model';
import { User } from 'src/users/models/_user.model';
import { Collage } from 'src/collage/entities/collage.entity';
import { Semester } from 'src/subjects/models/subject.model';

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
  @Prop({ type: String, required: true })
  name: string;

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

  @Prop({ type: String, required: true, enum: Object.values(Semester) })
  semester: Semester;

  @Prop(
    raw([
      {
        student: {
          type: MongooseSchema.Types.ObjectId,
          ref: User.name, ///EDDITON
          required: true,
        },
        isTeamLeader: { type: Boolean, default: false },
      },
    ]),
  )
  students: Record<string, any>[];

  @Prop({
    type: Boolean, default: true
  })
  enable?: boolean;
}
const GroupSchema = SchemaFactory.createForClass(Group);

export { GroupSchema };

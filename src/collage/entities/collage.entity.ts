// export class Collage {}
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { University } from 'src/university/models/university.model';
import { Document } from 'mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

export type CollageDocument = Collage & Document;


@Schema({ timestamps: true })
export class Collage
{
  id?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: University.name,
    required: true,
  })
  university: string;

  @Prop({ type: String, required: true })
  nameAr: string;

  @Prop({ type: String, required: true })
  nameEn: string;


  @Prop({
    type: Boolean, default: true
  })
  enable?: boolean;
}

const CollageSchema = SchemaFactory.createForClass(Collage);

export { CollageSchema };

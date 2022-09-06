import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, ObjectId, AcceptsDiscriminator } from 'mongoose';

export type UniversityDocument = University & Document;

@Schema({ timestamps: true })
export class University {
  id?: string;

  @Prop({ type: String, required: true })
  photo: string;

  @Prop({ type: String, required: true })
  nameAr: string;

  @Prop({ type: String, required: true })
  nameEn: string;
}

const UniversitySchema = SchemaFactory.createForClass(University);

export { UniversitySchema };

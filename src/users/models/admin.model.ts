import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User, UserRole } from './_user.model';

export type AdminDocument = Admin & Document;

@Schema()
export class Admin {
  role: UserRole;

  @Prop({ type: String })
  code: string;
}

const AdminSchema = SchemaFactory.createForClass(Admin);

export { AdminSchema };

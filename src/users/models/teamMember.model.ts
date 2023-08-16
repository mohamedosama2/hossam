import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Constants } from 'src/utils/constants';
import { UserRole } from './_user.model';
export enum JopTitle {
  DEVELOPER = 'DEVELOPER',
  REPORTER = 'REPORTER',
}
export type TeamMemberDocument = TeamMember & Document;

@Schema()
export class TeamMember {
  role: UserRole;



  @Prop({ required: true, type: String, enum: Object.values(JopTitle) })
  jobTitle: JopTitle;

  @Prop({
    index: true,
    unique: true,
    sparse: true,
    match: Constants.PHONE_REGX,
  })
  whatsapp: string;
}

const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);

export { TeamMemberSchema };

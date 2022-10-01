import { forwardRef, Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './models/group.model';
import { GroupRepository } from './group.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [GroupController],
  providers: [GroupService, GroupRepository],
  imports: [
    MongooseModule.forFeature([
      {
        name: Group.name,
        schema: GroupSchema,
      },
    ]),
    forwardRef(() => UsersModule),
  ],
  exports: [GroupRepository, GroupService],
})
export class GroupModule { }

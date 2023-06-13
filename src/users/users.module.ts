import {
  CacheModule,
  Module,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserRole, UserSchema } from './models/_user.model';
import { Student, StudentSchema } from './models/student.model';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UploadCloudinary } from 'src/utils/services/upload-cloudinary';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from './users.repository';
import { cacheOperationsModule } from 'src/cache/cache.module';
import { TeamMemberSchema } from './models/teamMember.model';
import { AdminSchema } from './models/admin.model';
import { GroupModule } from 'src/group/group.module';
import { CounterModule } from 'src/shared/counter.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        discriminators: [
          { name: UserRole.STUDENT, schema: StudentSchema },
          { name: UserRole.teamMember, schema: TeamMemberSchema },
          { name: UserRole.ADMIN, schema: AdminSchema },
        ],
      },
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: UploadCloudinary,
      inject: [ConfigService],
    }),
    GroupModule,
    CounterModule
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule { }

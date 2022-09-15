import { forwardRef, Module } from '@nestjs/common';
import { UniversityService } from './university.service';
import { UniversityController } from './university.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { University, UniversitySchema } from './models/university.model';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadCloudinary } from 'src/utils/services/upload-cloudinary';
import { UniversityRepository } from './university.repository';
import { SubjectsModule } from 'src/subjects/subjects.module';

@Module({
  imports: [
    SubjectsModule,
    MongooseModule.forFeature([
      {
        name: University.name,
        schema: UniversitySchema,
      },
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: UploadCloudinary,
      inject: [ConfigService],
    }),

  ],
  controllers: [UniversityController],
  providers: [UniversityService, UniversityRepository],
  exports: [UniversityService, UniversityRepository],
})
export class UniversityModule { }

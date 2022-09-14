import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subject, SubjectSchema } from './models/subject.model';
import { SubjectRepository } from './subjects.repository';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService, SubjectRepository],
  exports: [SubjectsService, SubjectRepository],
  imports: [
    MongooseModule.forFeature([
      {
        name: Subject.name,
        schema: SubjectSchema,
      },
    ]),
  ],
})
export class SubjectsModule { }

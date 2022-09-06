import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Subject, SubjectDocument } from './models/subject.model';

@Injectable()
export class SubjectRepository extends BaseAbstractRepository<Subject> {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
  ) {
    super(subjectModel);
  }
}

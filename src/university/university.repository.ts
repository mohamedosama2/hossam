import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { University, UniversityDocument } from './models/university.model';

@Injectable()
export class UniversityRepository extends BaseAbstractRepository<University> {
  constructor(@InjectModel(University.name) private universityModel: Model<UniversityDocument>) {
    super(universityModel);
  }
}

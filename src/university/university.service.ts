import { Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import
{
  CreateUniversityDto,
  FilterQueryOptionsUniversity,
} from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { UniversityDocument } from './models/university.model';
import { UniversityRepository } from './university.repository';
import
{
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { SubjectsModule } from 'src/subjects/subjects.module';
import { SubjectRepository } from 'src/subjects/subjects.repository';
var ObjectId = require('mongodb').ObjectId;

@Injectable()
export class UniversityService
{
  constructor(
    private readonly UniversityRepository: UniversityRepository,
    private readonly subjectRepository: SubjectRepository
  ) { }
  async create(createUniversityDto: CreateUniversityDto)
  {
    return await this.UniversityRepository.create(createUniversityDto);
  }

  async findAll(
    queryFiltersAndOptions: FilterQueryOptionsUniversity,
  ): Promise<PaginateResult<UniversityDocument> | UniversityDocument[]>
  {
    const universities =
      await this.UniversityRepository.findAllWithPaginationOption(
        queryFiltersAndOptions,
        ['nameAr', 'nameEn'],
      );
    return universities;
  }

  async findOne(_id: string)
  {
    const isExisted = await this.UniversityRepository.findOne({ _id });
    if (!isExisted) throw new NotFoundException();
    return isExisted;
  }

  async update(_id: string, updateUniversityDto: UpdateUniversityDto)
  {
    await this.findOne(_id);
    return await this.UniversityRepository.updateOne(
      { _id },
      updateUniversityDto,
    );
  }

  async deleteUniversity(id: string)
  {
    await this.subjectRepository.deleteAllVoid({ university: ObjectId(id) })
    return await this.UniversityRepository.deleteOne({ _id: id });
  }


}

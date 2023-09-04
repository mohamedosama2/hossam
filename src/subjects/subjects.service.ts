import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { FilterQueryOptionsSubject } from './dto/filter.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectDocument } from './models/subject.model';
import { SubjectRepository } from './subjects.repository';

@Injectable()
export class SubjectsService {
  constructor(private readonly SubjectRepository: SubjectRepository) { }
  async create(createSubjectDto: CreateSubjectDto) {
    return await this.SubjectRepository.create(createSubjectDto);
  }

  async findAll(
    queryFiltersAndOptions: FilterQueryOptionsSubject,
  ): Promise<PaginateResult<SubjectDocument> | SubjectDocument[]> {
    const universities =
      await this.SubjectRepository.findAllWithPaginationOption(
        queryFiltersAndOptions,
        ['nameAr', 'nameEn', 'university', 'collage', 'semester', 'enable'],
      );
    return universities;
  }


  async findOne(_id: string) {
    const subject = await this.SubjectRepository.findOne({ _id });
    if (!subject) throw new NotFoundException();
    return subject;
  }

  async update(_id: string, updateSubjectDto: UpdateSubjectDto) {
    await this.findOne(_id);
    return await this.SubjectRepository.updateOne({ _id }, updateSubjectDto as any);
  }

  async remove(_id: string) {
    await this.findOne(_id);
    return await this.SubjectRepository.updateOne({ _id }, {
      enable: false
    });
  }
}

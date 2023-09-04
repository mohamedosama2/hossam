import { CreateCollageDto } from './dto/create-collage.dto';
import { UpdateCollageDto } from './dto/update-collage.dto';
import { FilterQueryOptionsCollage } from './dto/filter.dto';
import { PaginateResult } from 'mongoose';
import { CollageDocument } from './entities/collage.entity';
import { CollageRepository } from './collage.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class CollageService {

  constructor(private readonly collageRepository: CollageRepository) { }

  async create(createCollageDto: CreateCollageDto) {
    return await this.collageRepository.create(createCollageDto);
  }

  async findAll(
    queryFiltersAndOptions: FilterQueryOptionsCollage
  ): Promise<PaginateResult<CollageDocument> | CollageDocument[]> {
    const universities =
      await this.collageRepository.findAllWithPaginationOption(
        queryFiltersAndOptions,
        ['nameAr', 'nameEn', 'university', 'enable'],
        { populate: ['university'] },
      );
    return universities;
  }


  async findOne(_id: string) {
    const subject = await this.collageRepository.findOne({ _id });
    if (!subject) throw new NotFoundException();
    return subject;
  }

  async update(_id: string, updateCollageDto: UpdateCollageDto) {
    await this.findOne(_id);
    return await this.collageRepository.updateOne({ _id }, updateCollageDto);
  }

  async remove(_id: string) {
    await this.findOne(_id);
    return await this.collageRepository.updateOne({ _id }, {
      enable: false
    });
  }
}

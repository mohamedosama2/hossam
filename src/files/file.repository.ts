import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { City, CityDocument } from 'src/cities/entities/city.entity';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { File, FileDocument } from './entities/file.entity';

@Injectable()
export class FileRepository extends BaseAbstractRepository<File> {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {
    super(fileModel);
  }

  public async create(data: FileDocument): Promise<FileDocument> {
    const newDocument = new this.fileModel(data).save();
    return newDocument;
  }
}

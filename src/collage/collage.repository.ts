import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Collage, CollageDocument } from './entities/collage.entity';

@Injectable()
export class CollageRepository extends BaseAbstractRepository<Collage> {
    constructor(
        @InjectModel(Collage.name) private collageModel: Model<CollageDocument>,
    ) {
        super(collageModel);
    }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Counter, CounterDocument } from './dto/counter.entity';
// import { InjectModel } from 'nestjs-typegoose';
// import { BaseRepository, ModelType } from 'src/shared/base.repository';
// import { Counter } from './dto/counter.entity';

@Injectable()
export class CounterRepository extends BaseAbstractRepository<Counter> {
  constructor(
    @InjectModel(Counter.name)
    private counterModel: Model<CounterDocument>,
  ) {
    super(counterModel);
  }

  // constructor(
  //     @InjectModel(Counter.name)
  //     private giftDataModel: Model<GiftDocument>,
  // ) {
  //     super(giftDataModel);
  // }

  // async createCounter(doc?: Partial<Counter>): Promise<Counter> {
  //     const counterModel = this.counterModel.create(doc);
  //     return await this.create(counterModel);
  // }

  async getCounter(entity: string) {
    let counter = await this.model.findOneAndUpdate({ entity: entity }, { $inc: { seq: 1 } } as any);
    if (!counter) {
      counter = await this.counterModel.create({ entity: entity, seq: 1 } as any) as any;
      counter.seq = 1;
    }

    return counter.seq;
  }

  async updateSequence(entity: string, seq: number) {
    await this.model.updateOne({ entity }, { seq });
  }
}

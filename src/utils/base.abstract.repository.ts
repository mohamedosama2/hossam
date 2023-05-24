import { NotFoundException } from '@nestjs/common';
import * as _ from 'lodash';
import { Document, FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';

type TDocument<T> = T & Document;
export abstract class BaseAbstractRepository<T> {
  protected model: Model<TDocument<T>>;

  protected constructor(model: Model<TDocument<T>>) {
    this.model = model;
  }

  public async create(data: any) {
    console.log('data ======================')
    console.log(data)
    const newDocument = await new this.model(data).save();
    return newDocument;
  }

  public async createDoc(data: T): Promise<TDocument<T>> {
    const newDocument = new this.model(data).save();
    return newDocument;
  }
  public async findOne(
    filterQuery: FilterQuery<TDocument<T>>,
    options: QueryOptions = {},
    projection: any = {},
  ): Promise<TDocument<T>> {
    // console.log('filterQuery')
    // console.log(filterQuery)
    const doc = await this.model.findOne(filterQuery, projection).setOptions(options);

    return doc;
  }

  public async findAllWithPaginationOption(
    queryFiltersAndOptions: any,
    arrayOfFilters: string[],
    extraOptions = {},
  ): Promise<TDocument<T>[]> {
    const filters: FilterQuery<TDocument<T>> = _.pick(queryFiltersAndOptions, arrayOfFilters);
    const options = _.pick(queryFiltersAndOptions, ['page', 'limit']);
    let docs;
    if (queryFiltersAndOptions.allowPagination) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      docs = await this.model.paginate(filters, {
        ...options,
        ...extraOptions,
        collation: { locale: 'en', caseLevel: true, numericOrdering: true },
      });
      console.log('========================================');
      console.log('True');
    } else {
      console.log('========================================');
      console.log('False');
      console.log(filters);

      docs = await this.model.find(filters).setOptions({ ...extraOptions });

      docs = { docs };
    }
    return docs;
  }

  public async deleteOne(filterQuery: FilterQuery<TDocument<T>>): Promise<void> {
    await this.model.deleteOne(filterQuery);
  }

  public async updateOne(
    filterQuery: FilterQuery<TDocument<T>>,
    updateQuery: UpdateQuery<TDocument<T>>,
    options: QueryOptions = {},
    projection: any = {},
  ): Promise<TDocument<T>> {
    console.log(filterQuery);
    console.log(updateQuery);
    const doc = await this.model.findOne(filterQuery, projection).setOptions(options);
    if (!doc) throw new NotFoundException(`${this.model.modelName} not found`);
    await doc.set(updateQuery).save();
    console.log('========================================');
    console.log(doc);
    return doc;
  }

  public async updateOneVoid(
    filterQuery: FilterQuery<TDocument<T>>,
    updateQuery: UpdateQuery<TDocument<T>>,
    options: QueryOptions = {},
  ): Promise<void> {
    await this.model.updateOne(filterQuery, updateQuery);
  }
  public async updateAllVoid(
    filterQuery: FilterQuery<TDocument<T>>,
    updateQuery: UpdateQuery<TDocument<T>>,
    options: QueryOptions = {},
  ): Promise<void> {
    await this.model.updateMany(filterQuery, updateQuery);
  }
}

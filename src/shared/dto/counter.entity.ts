import {
    Prop,
    Schema,
    SchemaFactory,
    DiscriminatorOptions,
    raw,
} from '@nestjs/mongoose';
import { Document, Model, ObjectId, Mongoose } from 'mongoose';
import { UserRole } from 'src/users/models/_user.model';
import { BaseModel } from 'src/utils/base.model';
import { Constants } from '../../utils/constants';
export type CounterDocument = Counter & Document;
@Schema({
    timestamps: true,
    toJSON: {
        getters: true,
        virtuals: true,
        transform: (_, doc: Record<string, unknown>) => {
            delete doc.__v;
            delete doc._id;
            return {
                ...doc,
            };
        },
    },
})
export class Counter {
    @Prop()
    entity: string;

    @Prop({ default: 0 })
    seq: number;
}

const CounterSchema = SchemaFactory.createForClass(Counter);



export { CounterSchema };



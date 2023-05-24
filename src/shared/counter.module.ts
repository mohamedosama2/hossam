import { Module } from '@nestjs/common';
// import { GovernorateService } from './governorate.service';
// import { GovernorateController } from './governorate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CounterRepository } from './counter.repository';
// import { Governorate, GovernorateSchema } from './entities/governorate.entity';
// import { GovernorateRepository } from './governorate.repository';
import { Counter, CounterSchema } from './dto/counter.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Counter.name,
                schema: CounterSchema,
            },
        ]),
    ],
    controllers: [],
    providers: [CounterRepository],
    exports: [CounterRepository]
})
export class CounterModule { }

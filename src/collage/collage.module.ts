import { Module } from '@nestjs/common';
import { CollageService } from './collage.service';
import { CollageController } from './collage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Collage, CollageSchema } from './entities/collage.entity';
import { CollageRepository } from './collage.repository';

@Module({
  controllers: [CollageController],
  providers: [CollageService, CollageRepository],
  exports: [CollageService, CollageRepository],
  imports: [
    MongooseModule.forFeature([
      {
        name: Collage.name,
        schema: CollageSchema,
      },
    ]),
  ],
})
export class CollageModule { }

import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FilessSchema } from './entities/file.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UploadDigitalOceanSpace } from 'src/utils/services/upload-dospace';
import { FileRepository } from './file.repository';
import { File } from './entities/file.entity';
// import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService, FileRepository],
  imports: [
    MongooseModule.forFeature([
      {
        name: File.name,
        schema: FilessSchema,
      }
    ]),
    MulterModule.registerAsync({// register async because it's import and inject in the same place 
      imports: [ConfigModule],
      useClass: UploadDigitalOceanSpace,
      inject: [ConfigService],
    }),
    // CloudinaryModule,
    ConfigModule
  ],

  exports: [FilesService, FileRepository]
})
export class FilesModule { }

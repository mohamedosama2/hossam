import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import * as crypto from 'crypto';
import * as mime from 'mime';
import { ConfigService } from '@nestjs/config';
import * as aws from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { Injectable } from '@nestjs/common';
@Injectable()
export class UploadDigitalOceanSpace implements MulterOptionsFactory {
  constructor(private readonly configService: ConfigService) { }
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: multerS3({
        s3: new aws.S3({
          accessKeyId: this.configService.get('DO_SPACE_ACCESS_KEY'),
          secretAccessKey: this.configService.get('DO_SPACE_SECRET_KEY'),
          endpoint: this.configService.get('DO_SPACE_END_POINT'),
          signatureVersion: 'v4',
        }),
        bucket: this.configService.get('DO_SPACE_BUCKET_NAME'),
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
          const raw = crypto.pseudoRandomBytes(8);
          cb(
            null,
            `${raw.toString('hex')}_${Date.now().toString()}/${file.originalname
            }`,
          );
        },
      }),
    };
  }
}

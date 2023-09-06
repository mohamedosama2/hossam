import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileRepository } from './file.repository';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as fs from 'fs'
@Injectable()
export class FilesService {
  private readonly s3: AWS.S3;
  // constructor(private readonly fileRepository: FileRepository) { }

  constructor(
    private readonly fileRepository: FileRepository,
    private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('DO_SPACE_ACCESS_KEY'),
      secretAccessKey: this.configService.get('DO_SPACE_SECRET_KEY'),
      endpoint: this.configService.get('DO_SPACE_END_POINT'),
      signatureVersion: 'v4'
    });
  }

  async create(createfileDto: CreateFileDto) {
    return await this.fileRepository.create(createfileDto as any);
  }

  // async uploadFilesToDO(filePath: string, bucketName: string, projectName: string, folderName: string, fileName: string) {
  //   const file = fs.readFileSync(filePath);
  //   const data = await this.s3.putObject({ Bucket: bucketName + '/' + projectName + '/' + folderName, Key: fileName, ACL: "public-read", Body: file, }).promise()
  //   return {
  //     URL: `https://${bucketName}.fra1.digitaloceanspaces.com/${projectName}/${folderName}/${fileName}`
  //   }
  // }

}

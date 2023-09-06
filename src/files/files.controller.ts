import { Body, Controller, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateFileDto } from './dto/create-file.dto';
import { FilesService } from './files.service';

// import { CreateTeamDto } from 'src/teams/dto/create-team.dto';
// import { TeamDocument } from 'src/teams/entities/team.entity';
import { ConfigService } from '@nestjs/config';
import * as path from 'path'
import { ApiMultiFile } from 'src/shared/decorators/api-file.decorator';
import { FileDocument } from './entities/file.entity';
import { Public } from 'src/auth/decorators/public.decorator';
// import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
// import LocalFilesInterceptor from 'src/utils/services/localFiles.interceptor';
import { FolderNameInterceptor, FolderNameInterceptorFunction } from './folder-name.interceptor';
// @ApiBearerAuth()
@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    // private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigService
  ) { }

  @Public()
  @Post('/photos')
  @UseInterceptors(FilesInterceptor('photos'))
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile('photos')
  // @UseInterceptors(new FolderNameInterceptor({ folderName: process.env.IMAGE_FOLDER_NAME })) //use interseptor as  a class 
  @UseInterceptors(FolderNameInterceptorFunction({ folderName: process.env.IMAGE_FOLDER_NAME })) // use of interseptor as a function
  createPhotos(
    @UploadedFiles()
    files,
    @Body() createFileDto: CreateFileDto,
  ): Promise<FileDocument> {
    const filesUp = [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        filesUp.push(files[i].location);
      }
      createFileDto.photos = filesUp;
    }

    return this.filesService.create(createFileDto);
  }

  @Public()
  @Post('/pdf')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile('files')
  @UseInterceptors(FolderNameInterceptorFunction({ folderName: process.env.GENERALFILES_FOLDER_NAME })) // use of interseptor as a function

  createFile(
    @UploadedFiles()
    files,
    @Body() createFileDto: CreateFileDto,
  ): Promise<FileDocument> {
    const filesUp = [];


    for (let i = 0; i < files.length; i++) {
      if (files) {
        filesUp.push(files[i].location);
      }
      createFileDto.files = filesUp;
    }
    return this.filesService.create(createFileDto);
  }

  // @Public()
  // @Post('/upload/xlsxFiles')
  // @UseInterceptors(LocalFilesInterceptor({
  //   fieldName: 'file',
  //   path: '/uploads'
  // }))
  // @ApiConsumes('multipart/form-data')
  // @ApiMultiFile('file')
  // async createFileTest(
  //   @UploadedFile()
  //   file,

  // ) {
  //   let result = await this.cloudinaryService.uploadFileExtentions(file.path)
  //   return { results: result.location }
  // }





  // @Public()
  // @Post('DO/SPACE/upload/xlsxFiles')
  // @UseInterceptors(LocalFilesInterceptor({
  //   fieldName: 'file',
  //   path: '/uploads'
  // }))
  // @ApiConsumes('multipart/form-data')
  // @ApiMultiFile('file')
  // uploadFilesToDO(
  //   @UploadedFile()
  //   file,
  // ) {
  //   const filePath = __dirname.replace('dist', 'src') + '/remah.png';
  //   const folderName = 'HSE'
  //   const bucketName = this.configService.get('DO_SPACE_BUCKET_NAME');
  //   const fileName = Date.now() + path.extname(filePath);
  //   return this.filesService.uploadFilesToDO(filePath, bucketName, folderName, fileName, '');
  // }
}

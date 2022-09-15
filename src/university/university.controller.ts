import
{
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { UniversityService } from './university.service';
import
{
  CreateUniversityDto,
  FilterQueryOptionsUniversity,
} from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/models/_user.model';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PaginateResult } from 'mongoose';
import { UniversityDocument } from './models/university.model';
import ParamsWithId from 'src/utils/paramsWithId.dto';

@ApiBearerAuth()
@ApiTags('UNIVERSITY')
@Controller('university')
export class UniversityController
{
  constructor(private readonly universityService: UniversityService) { }

  @Roles(UserRole.ADMIN)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }]))
  @ApiConsumes('multipart/form-data')
  async create(
    @UploadedFiles()
    files,
    @Body() createUniversityDto: CreateUniversityDto,
  )
  {
    if (files && files.photo)
      createUniversityDto.photo = files.photo[0].secure_url;

    return this.universityService.create(createUniversityDto);
  }

  @Get()
  async findAll(
    @Query() queryFiltersAndOptions: FilterQueryOptionsUniversity,
  ): Promise<PaginateResult<UniversityDocument> | UniversityDocument[]>
  {
    return await this.universityService.findAll(queryFiltersAndOptions);
  }

  @Get(':id')
  async findOne(@Param() { id }: ParamsWithId)
  {
    return await this.universityService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }]))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param() { id }: ParamsWithId,
    @UploadedFiles()
    files,
    @Body() updateUniversityDto: UpdateUniversityDto,
  )
  {
    if (files && files.photo)
      updateUniversityDto.photo = files.photo[0].secure_url;
    console.log(updateUniversityDto);
    return this.universityService.update(id, updateUniversityDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param() { id }: ParamsWithId)
  {
    return await this.universityService.deleteUniversity(id);
  }
}

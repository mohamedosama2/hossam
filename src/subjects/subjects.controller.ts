import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/models/_user.model';
import { FilterQueryOptionsSubject } from './dto/filter.dto';
import { PaginateResult } from 'mongoose';
import { SubjectDocument } from './models/subject.model';
import ParamsWithId from 'src/utils/paramsWithId.dto';

@ApiBearerAuth()
@ApiTags('subjects'.toUpperCase())
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  async findAll(
    @Query() queryFiltersAndOptions: FilterQueryOptionsSubject,
  ): Promise<PaginateResult<SubjectDocument> | SubjectDocument[]> {
    return await this.subjectsService.findAll(queryFiltersAndOptions);
  }




  @Get(':id')
  async findOne(@Param() { id }: ParamsWithId) {
    return await this.subjectsService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param() { id }: ParamsWithId,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectsService.update(id, updateSubjectDto);
  }

}
/*   @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param() { id }: ParamsWithId) {
    return this.subjectsService.remove(id);
  } */

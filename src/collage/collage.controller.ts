
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CollageService } from './collage.service';
import { CreateCollageDto } from './dto/create-collage.dto';
import { UpdateCollageDto } from './dto/update-collage.dto';
import { UserRole } from 'src/users/models/_user.model';
import { Roles } from 'src/auth/decorators/roles.decorator';
import ParamsWithId from 'src/utils/paramsWithId.dto';
import { PaginateResult } from 'mongoose';
import { FilterQueryOptionsCollage } from './dto/filter.dto';
import { CollageDocument } from './entities/collage.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiBearerAuth()
@ApiTags('collage'.toUpperCase())
@Controller('collage')
export class CollageController {
  constructor(private readonly collageService: CollageService) { }

  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createCollageDto: CreateCollageDto) {
    createCollageDto.enable = true
    return this.collageService.create(createCollageDto);
  }

  @Get()
  async findAll(
    @Query() queryFiltersAndOptions: FilterQueryOptionsCollage,
  ): Promise<PaginateResult<CollageDocument> | CollageDocument[]> {
    return await this.collageService.findAll(queryFiltersAndOptions);
  }




  @Get(':id')
  async findOne(@Param() { id }: ParamsWithId) {
    return await this.collageService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param() { id }: ParamsWithId,
    @Body() updateCollageDto: UpdateCollageDto
  ) {
    return this.collageService.update(id, updateCollageDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param() { id }: ParamsWithId) {
    return this.collageService.remove(id);
  }
}

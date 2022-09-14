import
{
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/models/_user.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterQueryOptionsGroup } from './dto/filter.dto';
import { PaginateResult } from 'mongoose';
import { GroupDocument } from './models/group.model';
import ParamsWithId from 'src/utils/paramsWithId.dto';

@ApiBearerAuth()
@ApiTags('group'.toUpperCase())
@Controller('group')
export class GroupController
{
  constructor(private readonly groupService: GroupService) { }

  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createGroupDto: CreateGroupDto)
  {
    return await this.groupService.create(createGroupDto);
  }

  @Get()
  async findAll(
    @Query() queryFiltersAndOptions: FilterQueryOptionsGroup,
  ): Promise<PaginateResult<GroupDocument> | GroupDocument[]>
  {
    return await this.groupService.findAll(queryFiltersAndOptions);
  }

  @Get(':id')
  async findOne(@Param() { id }: ParamsWithId)
  {
    return await this.groupService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param() { id }: ParamsWithId,
    @Body() updateGroupDto: UpdateGroupDto,
  )
  {
    return await this.groupService.update(id, updateGroupDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param() { id }: ParamsWithId)
  {
    return await this.groupService.remove(id);
  }
}

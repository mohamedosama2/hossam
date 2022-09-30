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
import { Injectable, NotFoundException } from '@nestjs/common';

import { TasksService } from './tasks.service';
import { CreateDtoTasks, CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserDocument, UserRole } from 'src/users/models/_user.model';
import { FilterQueryOptionsTasks, FilterQueryTasks } from './dto/filter.dto';
import { UsersService } from 'src/users/users.service';
import { AuthUser } from 'src/auth/decorators/me.decorator';

@ApiBearerAuth()
@ApiTags('tasks'.toUpperCase())
@Controller('tasks')
export class TasksController
{
  constructor(
    private readonly usersService: UsersService,
    private readonly tasksService: TasksService) { }

  @Roles(UserRole.ADMIN)
  @Post('/add')
  async create(@Body() createTaskDto: CreateTaskDto)
  {
    let manager = await this.usersService.findOne({ _id: createTaskDto.taskManager.id })
    if (!manager) throw new NotFoundException('user not found')
    createTaskDto.taskManager.id = manager._id
    createTaskDto.taskManager.name = manager.username
    return await this.tasksService.create(createTaskDto);
  }

  @Get('home')
  async hetHone(@Query() CreateDtoTasks: CreateDtoTasks, @AuthUser() me: UserDocument)
  {

    return await this.tasksService.getHome(CreateDtoTasks.date, me);
  }


  @Get()
  findAll(@Query() FilterQueryOptionsTasks: FilterQueryOptionsTasks, @AuthUser() me: UserDocument)
  {
    return this.tasksService.findAll(FilterQueryOptionsTasks, me);
  }

  @Get('week-calender')
  async getWeek(@Query() CreateDtoTasks: CreateDtoTasks, @AuthUser() me: UserDocument)
  {
    console.log(CreateDtoTasks);
    return await this.tasksService.getWeek(CreateDtoTasks.date, me);
  }

  @Get(':id')
  findOne(@Param('id') id: string)
  {
    return this.tasksService.findOne(id);
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto)
  {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string)
  {
    return this.tasksService.deleteTask(id);
  }

}

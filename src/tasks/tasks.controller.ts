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
import { Injectable, NotFoundException } from '@nestjs/common';

import { TasksService } from './tasks.service';
import { CreateDtoTasks, CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserDocument, UserRole } from 'src/users/models/_user.model';
import { FilterQueryOptionsTasks } from './dto/filter.dto';
import { UsersService } from 'src/users/users.service';
import { AuthUser } from 'src/auth/decorators/me.decorator';
import { CreateAdminTaskDto } from './dto/create-admin-task.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiBearerAuth()
@ApiTags('tasks'.toUpperCase())
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tasksService: TasksService,
  ) { }
  @Get('all-tasks')
  async findAllTasks(
    @Query() FilterQueryOptionsTasks: FilterQueryOptionsTasks,
    @AuthUser() me: UserDocument,
  ) {
    console.log('CONTROLLER', FilterQueryOptionsTasks);
    return this.tasksService.findAll(FilterQueryOptionsTasks, me);
  }

  // @Roles(UserRole.ADMIN)
  @Public()
  @Post('/add')
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.create(createTaskDto);
  }

  @Post('/add/admin')
  async createAdminTask(
    @Body() createTaskDto: CreateAdminTaskDto,
    @AuthUser() me: UserDocument,
  ) {
    console.log('here22');
    console.log(me);
    console.log(me.username);
    let adminData = {
      id: me._id,
      name: me.username,
    };
    // let manager = await this.usersService.findOne({ _id: createTaskDto.taskManager.id })
    // if (!manager) throw new NotFoundException('user not found')
    console.log(createTaskDto.taskManager);
    createTaskDto.taskManager = adminData;
    console.log('here55');
    // createTaskDto.taskManager.name = me.username
    createTaskDto.isAdminTask = true;
    createTaskDto.isDeletedTask = false;
    console.log(createTaskDto.taskManager);
    return await this.tasksService.createAdmin(createTaskDto as any);
  }

  @Get('home')
  async hetHone(
    @Query() CreateDtoTasks: CreateDtoTasks,
    @AuthUser() me: UserDocument,
  ) {
    return await this.tasksService.getHome(CreateDtoTasks.date, me);
  }

  @Get('week-calender')
  async getWeek(
    @Query() CreateDtoTasks: CreateDtoTasks,
    @AuthUser() me: UserDocument,
  ) {
    console.log(CreateDtoTasks);
    return await this.tasksService.getWeek(CreateDtoTasks.date, me);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}

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
import { TasksService } from './tasks.service';
import { CreateDtoTasks, CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/models/_user.model';
import { FilterQueryOptionsTasks, FilterQueryTasks } from './dto/filter.dto';

@ApiBearerAuth()
@ApiTags('tasks'.toUpperCase())
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Query() FilterQueryOptionsTasks: FilterQueryOptionsTasks) {
    return this.tasksService.findAll(FilterQueryOptionsTasks);
  }

  @Get('week-calender')
  async getWeek(@Query() CreateDtoTasks: CreateDtoTasks) {
    console.log(CreateDtoTasks);
    return await this.tasksService.getWeek(CreateDtoTasks.date);
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

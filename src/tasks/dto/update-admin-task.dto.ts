import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { CreateAdminTaskDto } from './create-admin-task.dto';

export class UpdateAdminTaskDto extends PartialType(CreateAdminTaskDto) { }

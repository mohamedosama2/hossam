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
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/models/_user.model';
import ParamsWithId from 'src/utils/paramsWithId.dto';
import { AggregationOpptionsDto } from 'src/utils/pagination/paginationParams.dto';

@ApiBearerAuth()
@ApiTags('payment'.toUpperCase())
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get('task-pyaments/:id')
  async findAllPaymentsToTask(
    @Param() { id }: ParamsWithId,
    @Query() AggregationOpptionsDto: AggregationOpptionsDto,
  ) {
    return await this.paymentService.findAll(id, AggregationOpptionsDto);
  }

  @Get('task-details/:id')
  async findTaskDetails(@Param() { id }: ParamsWithId) {
    return await this.paymentService.findTaskDetails(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}

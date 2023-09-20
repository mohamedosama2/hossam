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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserDocument, UserRole } from 'src/users/models/_user.model';
import ParamsWithId from 'src/utils/paramsWithId.dto';
import { AggregationOpptionsDto } from 'src/utils/pagination/paginationParams.dto';
import { PaymentType } from './models/payment.model';
import { AuthUser } from 'src/auth/decorators/me.decorator';
import { FilterQueryOptionsPayment } from './dto/filter.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiBearerAuth()
@ApiTags('payment'.toUpperCase())
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Roles(UserRole.ADMIN)
  @Post('/expensis')
  createExpensis(@Body() createPaymentDto: CreatePaymentDto) {
    createPaymentDto.paymentType = PaymentType.EXPENSIS;
    return this.paymentService.createExpensis(createPaymentDto);
  }

  @Roles(UserRole.ADMIN)
  @Post('/revenue')
  createRevenue(@Body() createPaymentDto: CreatePaymentDto) {
    createPaymentDto.paymentType = PaymentType.REVENUSE;
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  findAll(
    @Query() FilterQueryOptionsTasks: FilterQueryOptionsPayment,
    @AuthUser() me: UserDocument,
  ) {
    return this.paymentService.findAll(FilterQueryOptionsTasks, me);
  }

  @Get('/all/grouped')
  findAllNew(
    @Query() FilterQueryOptionsTasks: FilterQueryOptionsPayment,
    @AuthUser() me: UserDocument,
  ) {
    return this.paymentService.findAllNew(FilterQueryOptionsTasks, me);
  }

  @Public()
  @Get('task-details/:id')
  async findTaskDetails(@Param() { id }: ParamsWithId) {
    return await this.paymentService.findTaskDetails(id);
  }

  @ApiQuery({ name: 'paymentType', description: '[REVENUSE , EXPENSIS ]', required: true, type: String })
  @Get('all/type')
  async findTaskDetailsTeam(@Query('paymentType') paymentType: PaymentType) {
    return await this.paymentService.allPaymentMony(paymentType);
  }

  @Get(':teamMember/all-payments')
  MonyTest(@Param('teamMember') teamMember: string) {
    return this.paymentService.teamMemberMony(teamMember);
  }

}
/*   @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  } */
/* 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  } */

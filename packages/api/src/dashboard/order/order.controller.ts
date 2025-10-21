import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  Patch, 
  Scope, 
  UseGuards, 
  ValidationPipe, 
  Query, 
  Post, 
  Logger
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { CreateManualOrderDto, UpdateOrderDto, UpdatePaymentStatusDto } from './dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller({
  path: 'dashboard/orders',
  scope: Scope.REQUEST, 
})
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createManualOrder(@Body(ValidationPipe) createManualOrderDto: CreateManualOrderDto) {
    Logger.log('Creating manual order with DTO at controller:', createManualOrderDto);
    return this.orderService.createManualOrder(createManualOrderDto);
  }

  @Get()
  findAll(@Query(ValidationPipe) paginationQuery: PaginationQueryDto) {
    return this.orderService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body(ValidationPipe) updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateStatus(id, updateOrderDto);
  }
  
  @Patch(':id/payment-status')
  updatePaymentStatus(@Param('id') id: string, @Body(ValidationPipe) updatePaymentStatusDto: UpdatePaymentStatusDto) {
      return this.orderService.updatePaymentStatus(id, updatePaymentStatusDto);
  }
}
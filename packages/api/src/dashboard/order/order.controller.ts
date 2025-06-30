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
  Post // <-- Make sure Post is imported
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';
// <-- Make sure CreateManualOrderDto is imported
import { CreateManualOrderDto, UpdateOrderDto, UpdatePaymentStatusDto } from './dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller({
  path: 'dashboard/orders',
  scope: Scope.REQUEST, 
})
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // THIS IS THE NEW METHOD TO ADD OR FIX
  @Post()
  createManualOrder(@Body(ValidationPipe) createManualOrderDto: CreateManualOrderDto) {
    return this.orderService.createManualOrder(createManualOrderDto);
  }

  // Your existing GET and PATCH methods below
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
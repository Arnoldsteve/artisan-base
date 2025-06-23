import { Controller, Get, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderService } from './order.service';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll(@GetUser() user) {
    const tenantId = user?.store?.id;
    if (!tenantId) {
      throw new UnauthorizedException('User is not affiliated with a store.');
    }
    return this.orderService.findAllForTenant(tenantId);
  }

  
}
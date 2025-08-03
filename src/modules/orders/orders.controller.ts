import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthenticatedRequest } from '../auth/types/types';
import { OrderStatusDto } from './dtos/orders.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create')
  async createOrder(@Request() req: AuthenticatedRequest) {
    return this.ordersService.createOrderFromCart(req.user.sub);
  }

  @Get()
  async getAllOrders(@Request() req: AuthenticatedRequest) {
    return this.ordersService.getUserOrders(req.user.sub);
  }

  @Post(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() orderStatusData: OrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(
      {
        where: {
          id: +id,
        },
      },
      orderStatusData.status,
    );
  }
}

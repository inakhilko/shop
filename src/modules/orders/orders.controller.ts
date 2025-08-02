import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderStatus } from './constants/constants';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create')
  async createOrder(@Request() req) {
    return this.ordersService.createOrderFromCart(req.user.sub);
  }

  @Get()
  async getAllOrders(@Request() req) {
    return this.ordersService.getUserOrders(req.user.sub);
  }

  @Post(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() body,
  ) {
    return this.ordersService.updateOrderStatus(
      {
        where: {
          id: +id,
        },
      },
      body.status,
    );
  }
}

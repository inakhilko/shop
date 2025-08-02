import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderItem } from './entities/order-item.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { Cart } from '../cart/entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderStatus } from './constants/constants';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @Inject()
    private cartService: CartService,
  ) {}

  async createOrderFromCart(userId: number): Promise<Order> {
    const cart = await this.cartRepository.findOne({
      where: {
        user: { id: userId },
      },
      relations: ['items', 'items.product'],
    });

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is Empty');
    }

    const order = this.orderRepository.create({
      user: { id: userId },
      total: cart.total,
      status: OrderStatus.PENDING,
      items: [],
    });

    const savedOrder = await this.orderRepository.save(order);

    for (const cartItem of cart.items) {
      const orderItem = this.orderItemRepository.create({
        product: cartItem.product,
        quantity: cartItem.quantity,
        price: cartItem.product.price,
        order: savedOrder,
      });
      savedOrder.items.push(await this.orderItemRepository.save(orderItem));
    }

    await this.cartService.clearCart(userId);

    return savedOrder;
  }

  async getUserOrders(userId: number) {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderStatus(
    orderId: FindOneOptions<Order>,
    status: OrderStatus,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    console.log('order', order);

    order.status = status;
    return this.orderRepository.save(order);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getUserCart(userId: number): Promise<Cart | null> {
    return await this.cartRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['items', 'items.product'],
    });
  }

  async addToCart(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<Cart> {
    let cart = await this.getUserCart(userId);

    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId }, items: [] });
      cart = await this.cartRepository.save(cart);
    }

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    const existingItem = cart.items.find(
      (item) => item.product.id === productId,
    );
    if (existingItem) {
      existingItem.quantity += quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const newItem = this.cartItemRepository.create({
        product,
        quantity,
        cart,
      });
      cart.items.push(await this.cartItemRepository.save(newItem));
    }

    cart.total = this.calculateTotal(cart.items);
    return this.cartRepository.save(cart);
  }

  async removeFromCart(userId: number, productId: number): Promise<Cart> {
    const cart = await this.getUserCart(userId);

    if (!cart) {
      throw new NotFoundException(`Cart not found`);
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.id === productId,
    );
    if (itemIndex >= 0) {
      await this.cartItemRepository.remove(cart.items[itemIndex]);
      cart.items.splice(itemIndex, 1);
      cart.total = this.calculateTotal(cart.items);
      return this.cartRepository.save(cart);
    }

    return cart;
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.getUserCart(userId);

    if (cart) {
      await this.cartItemRepository.remove(cart.items);
      cart.items = [];
      cart.total = 0;
      await this.cartRepository.save(cart);
    }
  }

  calculateTotal(items: CartItem[]): number {
    return items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
  }
}

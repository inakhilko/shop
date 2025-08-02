import { Body, Controller, Delete, Get, Post, Request } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Request() req) {
    return this.cartService.getUserCart(req.user.sub);
  }

  @Post('add')
  async addProduct(
    @Request() req,
    @Body() productInfo: { productId: number; quantity: number },
  ) {
    return this.cartService.addToCart(req.user.sub, productInfo.productId, productInfo.quantity);
  }

  @Delete('remove')
  async removeProduct(@Request() req, @Body() productId: number) {
    return this.cartService.removeFromCart(req.user.sub, productId);
  }

  @Delete('clear')
  async clearCart(@Request() req) {
    return this.cartService.clearCart(req.sub.id);
  }
}

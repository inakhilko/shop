import { Body, Controller, Delete, Get, Post, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthenticatedRequest } from '../auth/types/types';
import { AddToCartProductDto, RemoveFromCartProductDto } from './dtos/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Request() req: AuthenticatedRequest) {
    return this.cartService.getUserCart(req.user.sub);
  }

  @Post('add')
  async addProduct(
    @Request() req: AuthenticatedRequest,
    @Body() productToAddInfo: AddToCartProductDto,
  ) {
    return this.cartService.addToCart(
      req.user.sub,
      productToAddInfo.productId,
      productToAddInfo.quantity,
    );
  }

  @Delete('remove')
  async removeProduct(
    @Request() req: AuthenticatedRequest,
    @Body() productToRemoveInfo: RemoveFromCartProductDto,
  ) {
    return this.cartService.removeFromCart(
      req.user.sub,
      productToRemoveInfo.productId,
    );
  }

  @Delete('clear')
  async clearCart(@Request() req: AuthenticatedRequest) {
    return this.cartService.clearCart(req.user.sub);
  }
}

import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartProductDto {
  @ApiProperty({
    example: 1,
    description: 'Product id to add to cart',
  })
  @IsNumber()
  productId: number;

  @ApiProperty({
    example: 1,
    default: 1,
    description: 'Quantity of product added to cart',
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class RemoveFromCartProductDto {
  @ApiProperty({
    example: 1,
    description: 'Product id to remove from cart',
  })
  @IsNumber()
  productId: number;
}

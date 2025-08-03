import { EOrderStatus } from '../constants/constants';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderStatusDto {
  @ApiProperty({
    enum: EOrderStatus,
    description: 'Order status (pending, paid, shipped, cancelled)',
  })
  @IsEnum(EOrderStatus)
  status: EOrderStatus;
}

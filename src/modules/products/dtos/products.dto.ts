import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Smartphone', description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Color blue, storage 128GB',
    description: 'Product description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 799.99, description: 'Product price' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 1, description: 'Product category id' })
  @IsNumber()
  categoryId: number;

  @ApiProperty({ example: 1, description: 'Product subcategory id' })
  @IsNumber()
  @IsOptional()
  subcategoryId?: number;
}

export class FilterProductDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @IsOptional()
  subcategoryId?: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

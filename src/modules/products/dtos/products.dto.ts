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
  @ApiProperty({
    example: 'phone',
    description: 'Value to search on product name',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ example: 10.5, description: 'Min product price' })
  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @ApiProperty({ example: 100.5, description: 'Max product price' })
  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @ApiProperty({ example: 1, description: 'Product category id' })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ example: 1, description: 'Product subcategory id' })
  @IsNumber()
  @IsOptional()
  subcategoryId?: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

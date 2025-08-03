import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubcategoryDto {
  @ApiProperty({ example: 'IPhone', description: 'Subcategory name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'IPhone models',
    description: 'Subcategory description',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: 1, description: 'Related category' })
  @IsNumber()
  categoryId: number;
}

export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {}

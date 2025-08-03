import { IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Clothes',
    description: 'Category name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Clothes for adults and children',
    description: 'Category description',
  })
  @IsString()
  @IsOptional()
  description: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

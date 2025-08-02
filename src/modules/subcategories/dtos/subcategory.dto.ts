import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateSubcategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  categoryId: number;
}

export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {}

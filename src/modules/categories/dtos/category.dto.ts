import { IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

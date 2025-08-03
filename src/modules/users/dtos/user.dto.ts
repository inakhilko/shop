import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { EUserRoles } from '../constants/constants';

export class CreateUserDto {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: true,
    description: 'Is user active',
  })
  @IsBoolean()
  isActive: boolean;
}

export class UpdateUserPropertiesDto extends PartialType(CreateUserDto) {}

export class ChangeUserRoleDto {
  @ApiProperty({
    example: 1,
    description: 'User id',
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: EUserRoles.ADMIN,
    description: 'New user role',
  })
  @IsEnum(EUserRoles)
  newRole: EUserRoles;
}

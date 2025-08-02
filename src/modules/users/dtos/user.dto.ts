import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  isActive: boolean;
}

export class UpdateUserDto extends CreateUserDto {
  id: number;
}

export class UpdateUserPropertiesDto extends PartialType(CreateUserDto) {}

export class UpdatedUserPropertiesDto extends UpdateUserPropertiesDto {
  id: number;
}

export enum EUserRoles {
  USER = 'user',
  ADMIN = 'admin',
}

export class ChangeUserRoleDto {
  userId: number;
  newRole: EUserRoles;
}

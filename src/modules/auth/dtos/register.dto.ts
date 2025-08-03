import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EUserRoles } from '../../users/constants/constants';

export class RegisterDto {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'a1GT36sd', description: 'Password' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    enum: EUserRoles,
    default: EUserRoles.USER,
    description: 'User role',
  })
  @IsEnum(EUserRoles)
  role: EUserRoles = EUserRoles.USER;
}

export class LoginDto {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'a1GT36sd', description: 'Password' })
  @IsString()
  @MinLength(8)
  password: string;
}

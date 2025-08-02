import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { EUserRoles } from '../../users/dtos/user.dto';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(EUserRoles)
  role: EUserRoles = EUserRoles.USER;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

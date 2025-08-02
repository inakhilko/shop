import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ChangeUserRoleDto,
  CreateUserDto,
  EUserRoles,
  UpdateUserPropertiesDto,
} from './dtos/user.dto';
import { Request } from 'express';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles(EUserRoles.ADMIN)
  @Get()
  getUsers(@Query('search') search: string, @Req() req: Request) {
    console.log(`REQUEST ID ${req.headers['x-request-id']}`);
    console.log(`LOCALE IS: ${req['locale']}`);
    return this.usersService.findAll(search);
  }

  @UseGuards(RolesGuard)
  @Roles(EUserRoles.ADMIN)
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @UseGuards(RolesGuard)
  @Roles(EUserRoles.ADMIN)
  @Post()
  @HttpCode(201)
  createUser(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.create(user);
  }

  @UseGuards(RolesGuard)
  @Roles(EUserRoles.ADMIN)
  @Put(':id')
  @HttpCode(200)
  updateUser(@Body() user: CreateUserDto, @Param('id') id: number) {
    return this.usersService.update(Number(id), user);
  }

  @UseGuards(AuthGuard, AuthGuard)
  @Roles(EUserRoles.ADMIN)
  @Patch('changeRole')
  changeUserRole(@Body() changeUserRoleData: ChangeUserRoleDto) {
    return this.usersService.changeUserRole(changeUserRoleData);
  }

  @UseGuards(AuthGuard, AuthGuard)
  @Roles(EUserRoles.ADMIN)
  @Patch(':id')
  updateUserProperties(
    @Param('id') id: number,
    @Body() userProperties: UpdateUserPropertiesDto,
  ) {
    return this.usersService.update(Number(id), userProperties);
  }

  @UseGuards(AuthGuard, AuthGuard)
  @Roles(EUserRoles.ADMIN)
  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: number) {
    await this.usersService.delete(Number(id));
  }
}

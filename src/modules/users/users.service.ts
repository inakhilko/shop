import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { User } from './entities/user.entity';
import { ChangeUserRoleDto } from './dtos/user.dto';
import { EUserRoles } from './constants/constants';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(private readonly userRepository: UserRepository) {}

  create(userData: Partial<User>) {
    const user: User = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findAll(search?: string): Promise<User[]> {
    return this.userRepository.findActiveUsers(search);
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} - not found`);
    }

    return user;
  }

  async update(id: number, updateData: Partial<User>) {
    const user = await this.findOne(Number(id));

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async delete(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.softRemove(user);
  }

  async changeUserRole({ userId, newRole }: ChangeUserRoleDto) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (user.role === EUserRoles.ADMIN) {
      throw new ForbiddenException('Cannot change role for admin users');
    }

    if (user.role === newRole) {
      throw new ForbiddenException('This role is already granted to this user');
    }

    if (!Object.values(EUserRoles).find((role) => role === newRole)) {
      throw new BadRequestException(`${newRole} does not exist`);
    }

    return this.userRepository.save({
      ...user,
      role: newRole,
    });
  }

  onModuleInit() {
    console.log('UsersService initialized');
  }
}

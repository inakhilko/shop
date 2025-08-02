import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findActiveUsers(search?: string): Promise<User[]> {
    const query = this.createQueryBuilder('user').where(
      'user.isActive = :active',
      { active: true },
    );

    if (search) {
      query.andWhere(
        'user.username ILIKE :search OR user.email ILIKE :search',
        { search: `%${search}%` },
      );
    }

    return query.orderBy('user.id', 'DESC').getMany();
  }
}

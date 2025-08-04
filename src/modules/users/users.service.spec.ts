import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './repository/user.repository';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Partial<Record<keyof UserRepository, jest.Mock>>;

  beforeEach(async () => {
    userRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      findActiveUsers: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create and save user', async () => {
      const mockUserData = { email: 'test@test.com' };
      const mockUser = { ...mockUserData, id: 1 };

      userRepository.create?.mockReturnValue(mockUser);
      userRepository.save?.mockResolvedValue(mockUser);

      const result = await service.create(mockUserData);

      expect(userRepository.create).toHaveBeenCalledWith(mockUserData);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should find all active users (no search arg)', async () => {
      const mockUsers = [{ id: 1 }, { id: 2 }, { id: 3 }];
      userRepository.findActiveUsers?.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(userRepository.findActiveUsers).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockUsers);
    });

    it('should find all active users (search arg)', async () => {
      const mockUsers = [{ id: 1 }, { id: 2 }, { id: 3 }];
      userRepository.findActiveUsers?.mockResolvedValue(mockUsers);

      const result = await service.findAll('A');

      expect(userRepository.findActiveUsers).toHaveBeenCalledWith('A');
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return user when found', async () => {
      const mockUser = { id: 1, name: 'one' };
      userRepository.findOneBy?.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user is not found', async () => {
      userRepository.findOneBy?.mockResolvedValue(undefined);

      await expect(service.findOne(444)).rejects.toThrow(
        new NotFoundException('User with id 444 - not found'),
      );
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const id = 1;
      const existingUser = {
        id,
        email: 'existing@test.com',
        isActive: true,
        role: 'user',
      };
      const updateData = { id, email: 'newemail@test.com' };

      const updatedUser = { ...existingUser, ...updateData };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingUser as User);
      userRepository.save?.mockResolvedValue(updatedUser);

      const result = await service.update(id, updateData);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });
  });
});

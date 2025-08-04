import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CanActivate } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { CreateUserDto } from './dtos/user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;

  beforeEach(async () => {
    usersService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      changeUserRole: jest.fn(),
    };
    const mockGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('getUsers', () => {
    it('should return users array', async () => {
      const mockUsers = [{ id: 1, name: 'Test' }];
      usersService.findAll?.mockResolvedValue(mockUsers);

      const req = {
        headers: { 'x-request-id': 'test-request-id' },
        locale: 'en',
      };

      const result = await controller.getUsers('test', req as any);

      expect(usersService.findAll).toHaveBeenCalledWith('test');
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUser', () => {
    it('should return single user', async () => {
      const mockUser = { id: 1, name: 'Test' };
      usersService.findOne?.mockResolvedValue(mockUser);

      const result = await controller.getUser('1');

      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { mock, MockProxy } from 'jest-mock-extended';
import { Cache } from 'cache-manager';
import { UserRepository } from '@/app/user/user.repository';
import { CreateUserInputDto } from '@/app/user/dtos/create-user-input.dto';
import { User } from '@/app/user/user.entity';
import { v4 as uuid } from 'uuid';
import { DataSource, UpdateResult } from 'typeorm';
import { UserDto } from '@/app/user/dtos/user.dto';

//@todo updateUser, listUsers
describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;
  let cacheManager: MockProxy<Cache>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: CACHE_MANAGER,
          useValue: mock<Cache>(),
        },
        {
          provide: 'DATA_SOURCE',
          useValue: mock<DataSource>(),
        },
        UserRepository,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
    cacheManager = module.get(CACHE_MANAGER);

    jest.spyOn(repository, 'save').mockImplementation(async (data) => {
      const id = uuid();
      return new User({
        ...data,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create user with success', async () => {
      const request = {
        name: 'Joao Batista',
        email: 'joao@gmail.com',
      } as CreateUserInputDto;

      jest.spyOn(repository, 'findByUsername').mockResolvedValueOnce(null);

      const result = await service.createUser(request);

      expect(result).toBeInstanceOf(UserDto);
      expect(result.id).toBeDefined();
      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.stringContaining('user:'),
        JSON.stringify(result),
      );
    });

    it('should not create an user if exists another user with samer username ', async () => {
      const request = {
        name: 'Joao Batista',
        email: 'joao@gmail.com',
        username: 'joao',
      } as CreateUserInputDto;

      jest
        .spyOn(repository, 'findByUsername')
        .mockResolvedValueOnce(new User());

      await expect(service.createUser(request)).rejects.toThrow(
        'Usuário já existe',
      );
    });
  });

  describe('deleteUser', () => {
    it('delete an user with success ', async () => {
      const id = uuid();

      const softDeleteSpied = jest
        .spyOn(repository, 'softDelete')
        .mockResolvedValueOnce({} as UpdateResult);

      await service.deleteUser(id);

      expect(cacheManager.del).toHaveBeenCalledWith(`user:${id}`);
      expect(softDeleteSpied).toHaveBeenCalledWith({ id });
    });
  });

  describe('findUserById', () => {
    it('should find an user by id in database', async () => {
      const id = uuid();
      const user = new User({
        id,
        name: 'Joao Batista',
        email: 'joao@gmail.com',
      });
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(user);
      cacheManager.get.mockResolvedValueOnce(null);

      const findUserByIdspy = jest.spyOn(repository, 'findUserById');

      const result = await service.findUserById(id);
      expect(result).toBeInstanceOf(UserDto);
      expect(result!.id).toBe(id);
      expect(cacheManager.get).toHaveBeenCalledWith(`user:${id}`);
      expect(findUserByIdspy).toHaveBeenCalled();
    });

    it('should return user in cache if exists', async () => {
      const id = uuid();
      const user = new User({
        id,
        name: 'Joao Batista',
        email: 'joao@gmail.com',
      });

      cacheManager.get.mockResolvedValueOnce(JSON.stringify(user));
      const findUserByIdspy = jest.spyOn(repository, 'findUserById');

      const result = await service.findUserById(id);
      expect(result).toBeInstanceOf(UserDto);
      expect(result!.id).toBe(id);
      expect(cacheManager.get).toHaveBeenCalledWith(`user:${id}`);
      expect(findUserByIdspy).not.toHaveBeenCalled();
    });

    it('should not found if user not exists', async () => {
      const id = uuid();

      cacheManager.get.mockResolvedValueOnce(null);

      jest.spyOn(repository, 'findUserById').mockResolvedValueOnce(null);

      await expect(service.findUserById(id)).rejects.toThrow(
        'Usuário não encontrado',
      );
    });
  });
});

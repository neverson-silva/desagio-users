import { CreateUserInputDto } from '@/app/user/dtos/create-user-input.dto';
import { User } from '@/app/user/user.entity';
import { UserRepository } from '@/app/user/user.repository';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDto } from '@/app/user/dtos/user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(userDto: CreateUserInputDto): Promise<UserDto> {
    const newUser: User = new User({
      username: userDto.username,
      name: userDto.name,
      email: userDto.email,
    });

    const existingUser = await this.userRepository.findByUsername(
      userDto.username,
    );

    if (existingUser) {
      throw new BadRequestException('Usuário já existe');
    }

    const createdUser = await this.userRepository.createUser(newUser);
    const result = new UserDto(createdUser);
    await this.setUserCache(result);
    return result;
  }

  async listUsers(): Promise<UserDto[]> {
    const usersInCache = await this.getsUserCache();

    if (usersInCache) {
      return usersInCache;
    }

    const users = await this.userRepository.listUsers();

    const result = users.map((user) => new UserDto(user));

    await this.setUsersCache(result);

    return result;
  }
  async getsUserCache(): Promise<UserDto[] | null> {
    const usersInCache = await this.cacheManager.get<string>(`users`);

    if (usersInCache) {
      return JSON.parse(usersInCache) as UserDto[];
    }

    return null;
  }

  async setUsersCache(users: UserDto[]): Promise<void> {
    await this.cacheManager.set(`users`, JSON.stringify(users));
  }

  async findUserById(id: string): Promise<UserDto | null> {
    const usersInCache = await this.getUserCache(id);
    if (usersInCache) {
      return new UserDto(usersInCache);
    }
    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    await this.setUserCache(user);

    return new UserDto(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.deleteUser(id);
    await this.deleteUserInCache(id);
  }

  async updateUser(id: string, userDto: Partial<User>): Promise<void> {
    const userDb = await this.userRepository.findUserById(id);
    if (!userDb) {
      throw new NotFoundException('Usuário não encontrado');
    }
    await this.deleteUserInCache(id);
    await this.userRepository.updateUser(id, userDto);
  }

  async setUserCache(user: UserDto) {
    await this.cacheManager.set(`user:${user.id}`, JSON.stringify(user));
    await this.cacheManager.del(`users`);
  }

  async deleteUserInCache(id: string): Promise<void> {
    await this.cacheManager.del(`user:${id}`);
    await this.cacheManager.del(`users`);
  }

  async getUserCache(id: string): Promise<User | null> {
    const userCache = await this.cacheManager.get<string>(`user:${id}`);
    if (userCache) {
      return JSON.parse(userCache ?? '') as User;
    }
    return null;
  }
}

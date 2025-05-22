import { User } from '@/app/user/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @Inject('DATA_SOURCE')
    dataSource: DataSource,
  ) {
    super(User, dataSource.manager);
  }
  async findByUsername(username: string): Promise<User | null> {
    return this.findOne({ where: { username } });
  }

  async createUser(userDto: Partial<User>): Promise<User> {
    return await this.save(userDto);
  }

  async listUsers(): Promise<User[]> {
    return this.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.findOneBy({ id });
  }

  async deleteUser(id: string): Promise<void> {
    await this.softDelete({ id });
  }

  async updateUser(id: string, userDto: Partial<User>): Promise<void> {
    await this.update(id, userDto);
  }
}

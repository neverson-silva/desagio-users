import { UserController } from '@/app/user/user.controller';
import { userProviders } from '@/app/user/user.providers';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [...userProviders],
  exports: [...userProviders],
})
export class UsersModule {}
